"use client";

import { motion } from "framer-motion";
import { Github, Linkedin } from "lucide-react";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout, Callout } from "@/components/docs-layout";
import { researchSidebar, researchPages } from "@/lib/research-data";

const page = researchPages["freertos"];

export default function ResearchContentPage() {
  if (!page) return <div>Page not found</div>;

  return (
    <StarfieldBackground>
      <Navbar />

      <DocsLayout
        sidebar={researchSidebar}
        breadcrumbs={page.breadcrumbs}
        toc={page.toc}
        prevPage={page.prevPage}
        nextPage={page.nextPage}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-48"
        >
          <h1>{page.title}</h1>

          <h2 id="why">Why Bare-Metal?</h2>
          <p>
            CubeMX is a code generation tool. You pick your chip, configure peripherals in a GUI, and it spits out a project. Fast to start, genuinely useful for complex peripheral setups, and it produces correct code.
          </p>
          <p>But it generates these files silently:</p>
          <ul>
            <li><code>startup_stm32f303x8.s</code> - assembly that runs before your main()</li>
            <li><code>STM32F303K8_FLASH.ld</code> - the linker script that tells gcc where flash and ram are</li>
            <li><code>system_stm32f3xx.c</code> - clock initialisation</li>
            <li><code>FreeRTOSConfig.h</code> - every single RTOS behavioural parameter</li>
            <li>the entire makefile / cmake setup</li>
          </ul>
          <p>
            When you don't write these yourself, you don't know what they do. And when something goes wrong at the hardware level (wrong interrupt priority, stack overflow, hard fault on scheduler start) you're debugging files you've never read. Not a great place to be. Doing it manually means you own every file.
          </p>
          <Callout type="tip">
            The full project is at <a href="https://github.com/abhinavuser/freertos-from-scratch" target="_blank" rel="noopener noreferrer">abhinavuser/freertos-from-scratch</a> on GitHub.
          </Callout>

          <h2 id="setup">Project Setup</h2>
          <p>
            The CPU jumps to an address it reads from the <strong>vector table</strong>, which is a table of function pointers sitting at the very start of flash. The reset handler does three things before calling your code:
          </p>
          <ol>
            <li>copies .data from flash to ram</li>
            <li>zeroes out .bss</li>
            <li>calls SystemInit() then main()</li>
          </ol>
          <p>
            Instead of writing raw pointers like <code>*((volatile uint32_t*)0x48000400) |= (1 &lt;&lt; 6);</code>, you write <code>GPIOB-&gt;MODER |= (1 &lt;&lt; 6);</code> using the standard CMSIS headers. These are provided by ST in the STM32CubeF3 HAL package, and you can just grab the specific files you need without importing the entire HAL.
          </p>

          <h2 id="linker">The Linker Script</h2>
          <p>
            The linker script is probably the most overlooked file in any embedded project, but it controls everything. For the STM32F303K8, you need to define two memory regions: 64KB of flash starting at 0x08000000, and 12KB of SRAM at 0x20000000. There is also 4KB of CCM (Core Coupled Memory) at 0x10000000 which connects directly to the CPU data bus, bypassing the AHB matrix. This makes CCM perfect for storing the stack of high-priority RTOS tasks since there is zero wait-state access.
          </p>
          <pre><code className="language-c">{`MEMORY
{
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 64K
  SRAM  (rwx) : ORIGIN = 0x20000000, LENGTH = 12K
  CCMRAM(rwx) : ORIGIN = 0x10000000, LENGTH = 4K
}`}</code></pre>
          <p>
            The .text and .rodata sections go into FLASH. The .data section has a load address in FLASH but a virtual address in SRAM because the startup code copies it over at boot. The .bss section lives entirely in SRAM and gets zeroed out. If you mess up the ORIGIN or LENGTH values, your code will hard fault instantly on boot and give you absolutely no error message. Ask me how I know.
          </p>

          <h2 id="config">FreeRTOSConfig.h</h2>
          <p>
            This is where you configure every behavioural aspect of the kernel. Getting it wrong means anything from scheduler crashes to silent priority inversions. The critical settings for the F303K8 are:
          </p>
          <pre><code className="language-c">{`#define configCPU_CLOCK_HZ          (SystemCoreClock)  // 72 MHz on F303K8
#define configTICK_RATE_HZ          ((TickType_t)1000) // 1ms tick
#define configMAX_PRIORITIES         5
#define configMINIMAL_STACK_SIZE    ((uint16_t)128)     // in words, so 512 bytes
#define configTOTAL_HEAP_SIZE       ((size_t)4096)      // 4KB, tight on 12KB SRAM
#define configUSE_PREEMPTION         1
#define configUSE_MUTEXES            1
#define configUSE_COUNTING_SEMAPHORES 1`}</code></pre>
          <p>
            The heap size is the trickiest part. You have 12KB of SRAM total, the .data and .bss sections eat some of that, and every task stack comes out of the FreeRTOS heap. With 4KB allocated to the heap, you can comfortably run about 3-4 tasks with 128-word stacks each. If you need more, you either reduce stack sizes (risky) or use static allocation (configSUPPORT_STATIC_ALLOCATION = 1) and manually place task stacks in CCM RAM.
          </p>

          <h2 id="kernel">Kernel Integration</h2>
          <p>
            FreeRTOS uses three ARM exceptions to implement its scheduler. Without mapping them correctly in FreeRTOSConfig.h, the scheduler starts and hard faults immediately because it tries to call handler functions that point to the default infinite loop:
          </p>
          <pre><code className="language-c">{`#define vPortSVCHandler     SVC_Handler
#define xPortPendSVHandler  PendSV_Handler
#define xPortSysTickHandler SysTick_Handler`}</code></pre>
          <p>
            SVC_Handler is the Supervisor Call that kicks off the first task. PendSV_Handler does the actual context switch (saving and restoring registers r4-r11 and the stack pointer). SysTick_Handler fires every tick and calls xTaskIncrementTick() to check if any task delays have expired and if a context switch is needed.
          </p>
          <p>
            The interrupt priority configuration is another place where things go wrong silently. On Cortex-M4, the NVIC uses the top N bits of the priority byte (4 bits on the F303, so priorities 0-15). FreeRTOS requires that PendSV and SysTick run at the lowest priority (15), and that any ISR calling FreeRTOS API functions (like xSemaphoreGiveFromISR) must have a priority value &gt;= configMAX_SYSCALL_INTERRUPT_PRIORITY. If you set a UART interrupt to priority 0 and call a FreeRTOS function from inside it, the kernel will corrupt its internal state with no visible crash until much later.
          </p>

          <h2 id="tasks">Tasks and Synchronization</h2>
          <p>
            Once the kernel is running, you create tasks with xTaskCreate(). Each task is just a function with an infinite loop. The simplest test is blinking an LED from one task and printing to UART from another, because it proves preemptive scheduling and peripheral access are both working correctly.
          </p>
          <pre><code className="language-c">{`void vLedTask(void *pvParameters) {
    for (;;) {
        GPIOB->ODR ^= (1 << 3);  // toggle PB3
        vTaskDelay(pdMS_TO_TICKS(500));
    }
}

void vUartTask(void *pvParameters) {
    for (;;) {
        uart_send_string("tick\\r\\n");
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}`}</code></pre>
          <p>
            For inter-task communication I used binary semaphores for simple signaling (ISR to task notification) and mutexes for shared resource protection (like a shared UART peripheral). Counting semaphores are useful if you have a producer-consumer pattern, like a sensor reading task filling a buffer that a processing task drains.
          </p>
          <p>
            The entire point of this project was understanding how all of these pieces fit together at the register level. Once you have done it manually, CubeMX generated code actually makes sense because you know exactly what every generated file is doing and why.
          </p>
        </motion.div>
      </DocsLayout>

      <footer className="border-t bg-background py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p>&copy; {new Date().getFullYear()} Abhinav Kumar . All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="https://github.com/abhinavuser" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/in/abhinav-kumar-v" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </StarfieldBackground>
  );
}
