"use client";
 
import { motion } from "framer-motion";
import { Github, Linkedin, Calendar, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { StarfieldBackground } from "@/components/StarfieldBackground";
import Navbar from "@/components/Navbar";
import { DocsLayout } from "@/components/docs-layout";
import { blogPosts, blogSidebar } from "@/lib/blog-data";
 
/* ───── full blog content keyed by slug ───── */
const blogContent: Record<string, React.ReactNode> = {
  "freertos-stm32-baremetal": (
    <>
      <h2 id="why-cubemx">why cubemx hides the things that actually matter</h2>
      <p>
        cubemx is a code generation tool. you pick your chip, tick some boxes in a gui for the peripherals you want, and it spits out a working project. it's fast, it's genuinely useful once you know what you're doing, and the code it produces is correct. that's not the problem.
      </p>
      <p>
        the problem is that it generates a bunch of files silently and you never actually read them:
      </p>
      <ul>
        <li><code>startup_stm32f303x8.s</code>: the assembly that runs before your main() even exists</li>
        <li><code>STM32F303K8_FLASH.ld</code>: the linker script that tells gcc where flash and ram physically live</li>
        <li><code>system_stm32f3xx.c</code>: clock tree initialisation</li>
        <li><code>FreeRTOSConfig.h</code>: every single rtos behavioural parameter, all 100+ of them</li>
        <li>the entire makefile / cmake build setup</li>
      </ul>
      <p>
        when you never write these yourself, you never learn what they do. and the first time something breaks at the hardware level (wrong interrupt priority, stack overflow, hard fault the instant the scheduler starts) you're stuck debugging five files you've literally never opened. doing it manually forces you to own every single line, which is annoying for about a week and then genuinely useful for the rest of your career.
      </p>
 
      <h2 id="the-hardware">the hardware: stm32f303k8 nucleo</h2>
      <p>
        i used the nucleo-f303k8. it's tiny, it's cheap (under a fiver on most sites), and the chip itself is more capable than people give it credit for:
      </p>
      <ul>
        <li>arm cortex-m4f core (the F means it has a hardware floating point unit, so float math isn't emulated in software)</li>
        <li>64 kb of flash starting at <code>0x08000000</code></li>
        <li>12 kb of sram at <code>0x20000000</code></li>
        <li>4 kb of ccm ram, core coupled memory that only the cpu can reach, dsp/adc peripherals can't dma into it</li>
        <li>gpio sitting on the ahb2 bus at <code>0x48000000</code></li>
        <li>rcc, the clock controller, at <code>0x40021000</code></li>
        <li>the onboard user led (ld3) wired to pb3</li>
      </ul>
      <p>
        that ahb2 detail is the one thing that breaks almost every stm32 tutorial you'll find online, because most of them are written for the f4 line, and on the f4 gpio sits on ahb1 at <code>0x40020000</code> instead. copy-paste a register offset from an f4 guide onto an f3 project and you'll get either a bus fault or gpio pins that just silently refuse to toggle. cost me about two hours the first time.
      </p>
 
      <h2 id="the-toolchain">the toolchain: what you actually install and why</h2>
      <p>
        four things, no ide required:
      </p>
      <ul>
        <li><strong>arm-none-eabi-gcc</strong>, the cross compiler. "none-eabi" means it's not targeting your host os, it's targeting bare metal arm with the embedded abi.</li>
        <li><strong>make</strong>, the build system tying object files, the linker script, and flags together.</li>
        <li><strong>openocd</strong>, the open on-chip debugger, which talks to the st-link programmer over usb and exposes a gdb server on localhost.</li>
        <li><strong>vs code + cortex-debug</strong>, optional, but it turns openocd + gdb into an actual clickable debugger with register views instead of typing gdb commands blind.</li>
      </ul>
      <pre><code className="language-bash">{`arm-none-eabi-gcc --version
openocd --version`}</code></pre>
      <p>
        the flag combination that trips people up most is the fpu flags. because the f303 has a real fpu, you want <code>-mcpu=cortex-m4 -mfpu=fpv4-sp-d16 -mfloat-abi=hard</code>. leave float-abi on soft and every float operation goes through a slow software routine instead of the fpu, your code still works, it's just quietly three to four times slower than it should be.
      </p>
 
      <h2 id="the-project">the project structure, file by file</h2>
      <p>
        here's what's actually in the repo and what each piece is responsible for.
      </p>
 
      <h3 id="startup-assembly">startup_stm32f303x8.s: what runs before main()</h3>
      <p>
        on reset, the cpu doesn't jump straight into your code. it reads the very first word in flash as the initial stack pointer, and the second word as the address of the reset handler, both taken from the <strong>vector table</strong>, which is just an array of function pointers sitting at address 0. from there, the reset handler does three things in order:
      </p>
      <ol>
        <li>copies the .data section (your initialised globals) from flash into ram, because ram is empty on power up</li>
        <li>zeroes out .bss (your uninitialised globals), since c assumes those start at zero</li>
        <li>calls SystemInit() to bring up the clock tree, then finally calls main()</li>
      </ol>
      <p>
        skip step one and any global initialised to a non-zero value will silently read back as garbage the first time you touch it. this is a genuinely common bug and it's invisible in the debugger unless you know to check.
      </p>
 
      <h3 id="linker-script">STM32F303K8_FLASH.ld: the linker script</h3>
      <p>
        this file tells gcc the physical memory map of the chip so it knows where to place code and data:
      </p>
      <pre><code className="language-ld">{`MEMORY {
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 64K
  RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 12K
  CCMRAM (rwx): ORIGIN = 0x10000000, LENGTH = 4K
}`}</code></pre>
      <p>
        the part that isn't obvious the first time you write one of these by hand is the difference between the load address (where a section physically lives in flash) and the virtual address (where it should appear to live once copied into ram). .data needs both, because it's stored in flash but referenced as if it's in ram, and getting that ldaddr/vma split wrong is exactly the kind of mistake that compiles fine and hard faults on the very first global variable access.
      </p>
 
      <h3 id="register-definitions">stm32f303k8.h: register definitions</h3>
      <p>
        instead of writing raw pointer casts like <code>*((volatile uint32_t*)0x48000400) |= (1 &lt;&lt; 6);</code> everywhere, you define a struct that maps onto the peripheral's memory layout and write <code>GPIOB-&gt;MODER |= (1 &lt;&lt; 6);</code>. same instruction under the hood, but readable, and the compiler will catch typos that a raw address never would.
      </p>
 
      <h3 id="freertos-config">FreeRTOSConfig.h: the rtos brain</h3>
      <p>
        three lines that almost every tutorial glosses over, and the ones most likely to give you a hard fault the instant the scheduler starts:
      </p>
      <pre><code className="language-c">{`#define vPortSVCHandler     SVC_Handler
#define xPortPendSVHandler  PendSV_Handler
#define xPortSysTickHandler SysTick_Handler`}</code></pre>
      <p>
        freertos relies on three built in arm cortex-m exceptions to run its scheduler: systick for the periodic tick, pendsv for the actual context switch, and svc to kick off the very first task. those defines remap freertos's internal handler names onto the actual interrupt vector names the startup file expects. skip this mapping and the vector table still points at empty default handlers, so the scheduler starts, immediately tries to fire pendsv, finds nothing there, and you get a hard fault with zero indication of why.
      </p>
      <p>
        one more setting worth calling out: <code>configCPU_CLOCK_HZ</code> has to match whatever your SystemInit() actually configured the core clock to. it's tempting to just paste the number from a datasheet's max clock speed, but if your clock config only takes you to 8MHz on the internal oscillator instead of 64MHz on the pll, every vTaskDelay() in your program will be wrong by that exact ratio, and your "500ms" blink will happily blink at 4 seconds instead. it took me embarrassingly long to notice that one.
      </p>
 
      <h3 id="board-c">board.c: gpio without hal</h3>
      <pre><code className="language-c">{`// step 1: enable gpiob clock on ahb2
RCC->AHBENR |= RCC_AHBENR_GPIOBEN;
 
// step 2: set pb3 as output
GPIOB->MODER &= ~(3U << 6);   // clear bits 7:6
GPIOB->MODER |=  (1U << 6);   // set 01 = output
 
// step 3: toggle
GPIOB->ODR ^= (1U << 3);`}</code></pre>
      <p>
        step one is easy to forget, and if you do, every register write to gpiob just silently does nothing, because the peripheral's clock is gated off and the bus doesn't even acknowledge the write. no fault, no error, no output. it just doesn't work, and there's nothing in the debugger pointing you at the cause.
      </p>
 
      <h3 id="freertos-app">freertos_app.c: two tasks, one queue</h3>
      <pre><code className="language-c">{`static QueueHandle_t xQueue;
 
void vLEDTask(void *pvParams) {
    uint32_t count = 0;
    board_led_init();
 
    for(;;) {
        board_led_toggle();
        xQueueSend(xQueue, &count, 0);
        count++;
        vTaskDelay(pdMS_TO_TICKS(500));   // yields for 500ms, doesn't burn cpu
    }
}
 
void vMonitorTask(void *pvParams) {
    uint32_t received;
    for(;;) {
        if(xQueueReceive(xQueue, &received, portMAX_DELAY) == pdTRUE) {
            (void)received;
        }
    }
}`}</code></pre>
      <p>
        the queue is the interesting bit. instead of using a shared global and hoping the two tasks don't stomp on each other mid-write, xQueueSend and xQueueReceive handle the synchronisation for you, and portMAX_DELAY means the monitor task literally consumes zero cpu while it's waiting, it's fully blocked, not polling. one gotcha: xTaskCreate's stack size argument is in <em>words</em>, not bytes, on a 32 bit core that's a 4x difference, and giving a task a stack that's actually a quarter of what you meant is a great way to get a stack overflow that only shows up under load.
      </p>
 
      <h2 id="the-bugs">the bugs: this is the real content</h2>
      <p>
        none of this shows up in a tutorial, because tutorials are written by people who already fixed these once and edited the pain back out. this is the stuff you only hit by actually doing it yourself.
      </p>
      <h3 id="bug-linker">bug: linker script missing the .init section</h3>
      <p>
        <strong>symptom:</strong> a linker error about overlapping output sections, but only once freertos was added to the build.<br/>
        <strong>cause:</strong> newlib (the c library arm-none-eabi-gcc links against) expects a <code>.init</code> and <code>.fini</code> section for constructor/destructor style startup code. my hand written linker script had never needed those before, because plain c doesn't use them, but freertos's heap implementation pulled in enough of newlib that it suddenly did.<br/>
        <strong>fix:</strong> add explicit <code>.init</code> and <code>.fini</code> output sections to the linker script, placed in flash alongside .text.
      </p>
      <h3 id="bug-priority-bits">bug: hard fault the instant vTaskStartScheduler() runs</h3>
      <p>
        <strong>symptom:</strong> the program ran fine up until the scheduler actually started, then immediately hard faulted, before either task had printed a single thing.<br/>
        <strong>cause:</strong> <code>configPRIO_BITS</code> in FreeRTOSConfig.h didn't match the chip. the cortex-m4 on the f303 implements 4 priority bits, but i'd copied a config file from an m0 example that only implements 2. freertos uses this value to correctly shift interrupt priorities into the nvic's priority registers, get it wrong and pendsv ends up scheduled at a priority the hardware doesn't actually respect.<br/>
        <strong>fix:</strong> checked the reference manual's nvic section for the actual implemented priority bits and set <code>configPRIO_BITS</code> to 4.
      </p>
      <h3 id="bug-stack-overflow">bug: memory corruption that only appeared after a few minutes</h3>
      <p>
        <strong>symptom:</strong> the led task would randomly stop blinking, or start blinking at the wrong rate, after running fine for a while.<br/>
        <strong>cause:</strong> one task's stack was undersized, and it slowly overflowed into adjacent ram, corrupting the other task's control block. classic silent stack overflow, the kind that doesn't crash immediately because it just quietly overwrites whatever happens to be next in memory.<br/>
        <strong>fix:</strong> turned on <code>configCHECK_FOR_STACK_OVERFLOW 2</code>, which adds a runtime check on every context switch and calls a hook function the moment it detects corruption, instead of letting it silently propagate.
      </p>
 
      <h2 id="how-freertos-runs">how freertos actually runs on this chip</h2>
      <p>
        the whole scheduler is built on three arm cortex-m exceptions, and it's worth actually understanding what each one does rather than treating them as magic:
      </p>
      <ul>
        <li><strong>systick</strong> fires on a fixed timer, once every 1ms by default, and is what increments the internal tick count and decides when a delayed task should wake up.</li>
        <li><strong>pendsv</strong> is where the actual context switch happens: saving the current task's registers to its stack, picking the next task to run, and restoring its registers. it's deliberately given the lowest priority in the system so it only runs once every other interrupt has finished, which keeps interrupt latency predictable.</li>
        <li><strong>svc</strong> (supervisor call) is used exactly once, right at startup, to transition from the initial reset context into running the very first task.</li>
      </ul>
 
      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        everything's up at <a href="https://github.com/abhinavuser/freertos-from-scratch" target="_blank" className="text-primary hover:underline">github.com/abhinavuser/freertos-from-scratch</a>. do it the hard way once. after that, cubemx actually makes sense, because you already know exactly what it's generating for you and why.
      </p>
    </>
  ),
 
  "toy-nn-runtime": (
    <>
      <h2 id="motivation">motivation</h2>
      <p>
        after spending months working with tflite, rknn, and armnn runtimes at work, i realised i could use all of them without actually understanding what happens between "load model" and "get prediction." so i built a stripped down inference runtime in c++ from scratch. the goal was never to compete with production tools, it was to actually understand memory management, operator dispatch, tensor layout, and graph execution well enough to explain them to someone else.
      </p>
      <h2 id="architecture">architecture</h2>
      <p>i kept it to a simple three layer design so the abstraction stayed clean and debuggable:</p>
      <ol>
        <li><strong>graph parser</strong>: reads a simplified json model format describing nodes, connections, and weights.</li>
        <li><strong>operator registry</strong>: a dispatch table, using function pointers and a bit of polymorphism, that routes an op name like <code>Conv2D</code> to its actual c++ implementation.</li>
        <li><strong>executor</strong>: walks the graph in topological order, allocates memory for intermediate tensors, and fires off each operator in sequence.</li>
      </ol>
 
      <h2 id="tensor">the tensor class</h2>
      <p>
        the tensor class ends up being the single most important piece of any runtime, because memory layout decisions (nchw vs nhwc) have a massive effect on cache locality, and cache misses are where most of the real world slowdown comes from, not the math itself. i implemented a basic n-dimensional tensor that tracks its shape dynamically and flattens multi-dimensional indices into a single offset:
      </p>
      <pre><code className="language-cpp">{`template<typename T>
class Tensor {
public:
    Tensor(std::vector<int> shape) : shape_(shape) {
        size_t total = 1;
        for (int dim : shape) total *= dim;
        data_.resize(total);
    }
 
    T& at(std::vector<int> indices) {
        return data_[flatten(indices)];
    }
 
private:
    std::vector<T> data_;
    std::vector<int> shape_;
 
    size_t flatten(const std::vector<int>& indices) {
        size_t idx = 0;
        size_t stride = 1;
        for (int i = shape_.size() - 1; i >= 0; --i) {
            idx += indices[i] * stride;
            stride *= shape_[i];
        }
        return idx;
    }
};`}</code></pre>
 
      <h2 id="operators">implementing operators</h2>
      <p>
        the core math. i started with a completely naive <code>Conv2D</code>, six nested loops deep, which is roughly o(n·k²·c_in·c_out) and about as far from optimal as you can get, but it's also the clearest possible statement of what convolution actually is:
      </p>
      <pre><code className="language-cpp">{`void conv2d(const Tensor<float>& input,
            const Tensor<float>& kernel,
            Tensor<float>& output,
            int stride, int padding) {
    for (int n = 0; n < batch; n++)
        for (int oc = 0; oc < out_channels; oc++)
            for (int oh = 0; oh < out_h; oh++)
                for (int ow = 0; ow < out_w; ow++) {
                    float sum = 0;
                    for (int ic = 0; ic < in_channels; ic++)
                        for (int kh = 0; kh < k_h; kh++)
                            for (int kw = 0; kw < k_w; kw++)
                                sum += input.at({...}) * kernel.at({...});
                    output.at({n, oc, oh, ow}) = sum;
                }
}`}</code></pre>
      <p>
        the bug that cost me the most time here wasn't in the math, it was in the innermost input index calculation. get the padding offset wrong by one and you don't crash, you just quietly read from the wrong memory location, so the network still "runs" and still produces a number, it's just a wrong one. i only caught it by writing a tiny numpy reference implementation and diffing outputs layer by layer until the mismatch showed up, which is honestly the only reliable way to debug numerical code like this.
      </p>
 
      <h2 id="memory-management">memory management</h2>
      <p>
        allocating and freeing vectors dynamically on every single inference call absolutely destroys performance, mostly from repeated heap allocation overhead rather than the math itself. to fix that, i implemented a basic arena allocator: the runtime walks the graph once at load time, calculates the maximum amount of memory needed by any two adjacent layers, allocates one big buffer up front, and then ping-pongs between offsets into that buffer during execution instead of calling malloc per layer.
      </p>
 
      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        it successfully ran a simple mnist classifier end to end. performance sat at roughly 100x slower than tflite, which makes sense given i wasn't using simd, thread pools, or operator fusion (folding a conv and a relu into a single pass instead of writing the intermediate result out and reading it back in). but watching the raw floating point math actually work, layer by layer, taught me more about how inference engines are built than any high level keras tutorial ever did.
      </p>
    </>
  ),
 
  "xiao-esp32s3-rtsp-stream": (
    <>
      <h2 id="overview">overview</h2>
      <p>
        the seeed studio xiao esp32s3 sense is ridiculously small, barely bigger than my thumb, yet it packs wifi, ble, a microsd slot, and an ov2640 camera module onto that footprint. i wanted to turn it into a tiny, low profile ip camera, and the simplest widely supported way to get video off it onto a local network is rtsp (real time streaming protocol), since basically every media player already knows how to open an rtsp url.
      </p>
 
      <h2 id="setup">prerequisites and setup</h2>
      <p>
        i used platformio for this because the arduino ide's board manager gets messy fast once you're juggling multiple esp32 variants. you need the <code>esp32</code> platform installed and the board set to <code>seeed_xiao_esp32s3</code>. the actual streaming is handled by the <code>Micro-RTSP</code> library, which wraps jpeg frames into rtp packets over tcp for you, so you're not writing raw socket and packetisation logic from scratch.
      </p>
 
      <h2 id="camera-config">camera initialization</h2>
      <p>
        the single most annoying part of any esp32 camera project is getting the pin mapping right. the xiao uses a custom camera daughterboard, so the standard esp32-cam pinouts you'll find in most guides are wrong for this board, and using them will crash the i2c bus the camera's control lines run over before you even get a single frame. here's the exact, tested pin config for the ov2640 on the xiao:
      </p>
      <pre><code className="language-cpp">{`camera_config_t config;
config.ledc_channel = LEDC_CHANNEL_0;
config.ledc_timer = LEDC_TIMER_0;
config.pin_d0 = 15;
config.pin_d1 = 17;
config.pin_d2 = 18;
config.pin_d3 = 16;
config.pin_d4 = 14;
config.pin_d5 = 12;
config.pin_d6 = 11;
config.pin_d7 = 48;
config.pin_xclk = 10;
config.pin_pclk = 13;
config.pin_vsync = 38;
config.pin_href = 47;
config.pin_sscb_sda = 40;
config.pin_sscb_scl = 39;
config.pin_pwdn = -1;
config.pin_reset = -1;
config.xclk_freq_hz = 20000000;
config.pixel_format = PIXFORMAT_JPEG;
config.frame_size = FRAMESIZE_VGA;
config.jpeg_quality = 10;
config.fb_count = 2; // dual buffering for smooth streaming
config.fb_location = CAMERA_FB_IN_PSRAM;`}</code></pre>
      <p>
        that last line matters more than it looks. the xiao's onboard sram is nowhere near big enough to hold two vga jpeg frame buffers, so if you leave fb_location on its default and skip enabling psram in the board config, camera init fails with ESP_ERR_NO_MEM and you get a confusing "camera init failed with error 0x105" in the serial monitor with no further explanation. took me a while to connect that error code back to a missing psram flag.
      </p>
 
      <h2 id="the-stream">starting the stream</h2>
      <p>
        once the camera is initialised and wifi is connected, ideally with a static ip so you're not hunting for it on the network every time it reboots, we spin up the rtsp server on port 8554. the main loop just grabs frames off the camera and feeds them into the broadcast buffer:
      </p>
      <pre><code className="language-cpp">{`void loop() {
    camera_fb_t * fb = esp_camera_fb_get();
    if (!fb) {
        Serial.println("camera capture failed");
        return;
    }
    
    // push frame to the rtsp server buffer
    rtspServer.broadcastFrame(fb->buf, fb->len);
    
    // return the frame buffer back to the camera driver
    esp_camera_fb_return(fb);
    
    // small delay to prevent watchdog panics
    delay(10);
}`}</code></pre>
      <p>
        that last delay isn't cosmetic. without it, the loop spins tight enough that the watchdog timer on the wifi task starves and the board resets itself every 30 to 60 seconds, which looks exactly like a random crash until you realise it's actually the watchdog doing its job.
      </p>
 
      <h2 id="performance">thermal management</h2>
      <p>
        this board gets surprisingly hot for its size. pushing vga frames at 20fps continuously over wifi keeps the esp32 near max power draw for as long as the stream is open. enclose it in a 3d printed case with no ventilation and it will thermal throttle, or crash outright, within about ten minutes. if you're running this 24/7, a small 10x10mm heatsink on the metal shield and a slightly lower framerate makes a real difference to stability. i also saw occasional brownout resets when powering it off a weak usb cable, the radio's current draw spikes are enough to sag a marginal supply momentarily and trip the brownout detector.
      </p>
 
      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        to view the stream, open vlc, go to network stream, and enter <code>rtsp://[xiao_ip]:8554/mjpeg/1</code>. latency sits around 200ms on a decent 2.4ghz router, which is honestly impressive for a board that costs about as much as a coffee and is smaller than one.
      </p>
    </>
  ),
 
  "rpi4-1d-cnn": (
    <>
      <h2 id="context">the context</h2>
      <p>
        when people say cnn, they almost always mean a 2d cnn processing images, cats vs dogs style classification. but a convolution is really just a sliding filter doing a dot product, and there's nothing image specific about that. use a 1-dimensional filter instead and you get a genuinely strong tool for time series data: accelerometers, gyroscopes, audio waveforms, ecg signals. 1d cnns are lighter, faster, and in my experience often more robust than lstms for this kind of sensor data, since they don't need to maintain hidden state across the whole sequence.
      </p>
 
      <h2 id="dataset">windowing the data</h2>
      <p>
        you can't just feed raw continuous sensor data into a network, you have to slice it into overlapping windows first. sample an imu at 100hz and a 2 second window gives you 200 samples. with x, y, and z axes, your input shape becomes <code>(200, 3)</code>. that's the fundamental input block the model is trained and later run against, and getting the window size wrong (too short and you lose the pattern, too long and you lose responsiveness) is its own separate tuning problem.
      </p>
 
      <h2 id="the-model">building the model</h2>
      <p>
        training happens offline on a pc with keras, and it ends up looking remarkably close to an image classification model, just with <code>Conv1D</code> swapped in for <code>Conv2D</code>:
      </p>
      <pre><code className="language-python">{`from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv1D, MaxPooling1D, Flatten, Dense
 
model = Sequential([
    Conv1D(filters=32, kernel_size=5, activation='relu', input_shape=(200, 3)),
    MaxPooling1D(pool_size=2),
    Conv1D(filters=64, kernel_size=3, activation='relu'),
    MaxPooling1D(pool_size=2),
    Flatten(),
    Dense(64, activation='relu'),
    Dense(num_classes, activation='softmax')
])
 
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=50, batch_size=32)`}</code></pre>
      <p>
        once it's trained and validation accuracy looks good, you export it to a <code>.tflite</code> file, which strips out everything training only (the optimiser state, gradient graph) and shrinks the file down to just what's needed for inference.
      </p>
 
      <h2 id="deployment">deploying on the pi</h2>
      <p>
        you do not want to <code>pip install tensorflow</code> on a raspberry pi. it drags in a huge dependency tree, is slow to import, and eats ram you don't have to spare. install only the <code>tflite-runtime</code> package instead, it's a fraction of the size and covers exactly the inference api you actually need:
      </p>
      <pre><code className="language-bash">{`pip3 install tflite-runtime numpy`}</code></pre>
 
      <h2 id="inference">threaded inference</h2>
      <p>
        the trick to real time embedded ai is keeping inference from blocking sensor reads. if a forward pass takes 5ms and you're reading sensors in the same loop, your sampling timing jitters by that same 5ms, which quietly degrades the very windows you're feeding the model. i used python's <code>threading</code> module: one thread constantly reads the i2c sensor into a circular buffer on a fixed schedule, and the main thread periodically copies out a snapshot of that buffer to run inference on.
      </p>
      <pre><code className="language-python">{`import numpy as np
import tflite_runtime.interpreter as tflite
 
interpreter = tflite.Interpreter(model_path="vibration_model.tflite")
interpreter.allocate_tensors()
 
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()
 
def run_inference(sensor_window):
    # sensor_window is shape (1, 200, 3)
    interpreter.set_tensor(input_details[0]['index'], sensor_window.astype(np.float32))
    interpreter.invoke()
    
    prediction = interpreter.get_tensor(output_details[0]['index'])
    return np.argmax(prediction)`}</code></pre>
      <p>
        two bugs cost me real time here. first, a race condition on the circular buffer: without a lock around the copy, the inference thread could read a window that the sensor thread was midway through overwriting, giving you a "torn" read that's half old data and half new. a simple lock around the copy fixed it, at the cost of a tiny bit of jitter on the sensor thread, which turned out to be a completely acceptable trade. second, and sneakier, a normalisation mismatch: the training pipeline subtracted the per-axis mean and divided by standard deviation before feeding data to the model, and i initially forgot to apply that exact same transform at inference time. the model didn't crash, it just quietly predicted garbage with high confidence, which is a genuinely unsettling kind of bug because everything looks like it's working.
      </p>
 
      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        on the raspberry pi 4b's cpu, a forward pass of this model takes roughly 1.5 milliseconds. that means you can comfortably classify high frequency machinery vibrations or gestures hundreds of times a second with basically no cpu overhead. it's a decent reminder that you don't always need an edge tpu or a neural accelerator stick to do useful local ai, sometimes a well windowed 1d cnn on a stock cpu is more than enough.
      </p>
    </>
  ),
};
 
/* ───── TOC for each blog post ───── */
const blogTOC: Record<string, { id: string; text: string; level: number }[]> = {
  "freertos-stm32-baremetal": [
    { id: "why-cubemx", text: "why cubemx hides things", level: 2 },
    { id: "the-hardware", text: "the hardware", level: 2 },
    { id: "the-toolchain", text: "the toolchain", level: 2 },
    { id: "the-project", text: "project structure", level: 2 },
    { id: "startup-assembly", text: "startup assembly", level: 3 },
    { id: "linker-script", text: "linker script", level: 3 },
    { id: "register-definitions", text: "register definitions", level: 3 },
    { id: "freertos-config", text: "freertos config", level: 3 },
    { id: "board-c", text: "board.c", level: 3 },
    { id: "freertos-app", text: "freertos app", level: 3 },
    { id: "the-bugs", text: "the bugs", level: 2 },
    { id: "bug-linker", text: "linker bug", level: 3 },
    { id: "bug-priority-bits", text: "priority bits bug", level: 3 },
    { id: "bug-stack-overflow", text: "stack overflow bug", level: 3 },
    { id: "how-freertos-runs", text: "how it runs", level: 2 },
    { id: "final-thoughts", text: "final thoughts", level: 2 },
  ],
  "toy-nn-runtime": [
    { id: "motivation", text: "motivation", level: 2 },
    { id: "architecture", text: "architecture", level: 2 },
    { id: "tensor", text: "the tensor class", level: 2 },
    { id: "operators", text: "implementing operators", level: 2 },
    { id: "memory-management", text: "memory management", level: 2 },
    { id: "final-thoughts", text: "final thoughts", level: 2 },
  ],
  "xiao-esp32s3-rtsp-stream": [
    { id: "overview", text: "overview", level: 2 },
    { id: "setup", text: "prerequisites and setup", level: 2 },
    { id: "camera-config", text: "camera initialization", level: 2 },
    { id: "the-stream", text: "starting the stream", level: 2 },
    { id: "performance", text: "thermal management", level: 2 },
    { id: "final-thoughts", text: "final thoughts", level: 2 },
  ],
  "rpi4-1d-cnn": [
    { id: "context", text: "the context", level: 2 },
    { id: "dataset", text: "windowing the data", level: 2 },
    { id: "the-model", text: "building the model", level: 2 },
    { id: "deployment", text: "deploying on the pi", level: 2 },
    { id: "inference", text: "threaded inference", level: 2 },
    { id: "final-thoughts", text: "final thoughts", level: 2 },
  ],
};
 
export default function BlogPostPage() {
  const pathname = usePathname();
  const slug = pathname.replace("/blogs/", "");
  const post = blogPosts.find((p) => p.slug === slug);
  const content = blogContent[slug];
  const toc = blogTOC[slug] || [];
 
  if (!post || !content) {
    return (
      <StarfieldBackground>
        <Navbar />
        <div className="container relative z-10 flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">Post Not Found</h1>
            <p className="text-muted-foreground">This blog post doesn&apos;t exist.</p>
            <Link href="/blogs" className="mt-4 inline-flex items-center gap-2 text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to all posts
            </Link>
          </div>
        </div>
      </StarfieldBackground>
    );
  }
 
  // Find prev/next posts
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : undefined;
  const nextPost =
    currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : undefined;
 
  const getShortTitle = (postSlug: string) => {
    const item = blogSidebar[0].children?.find((c) => c.href === `/blogs/${postSlug}`);
    return item?.label || "";
  };
 
  return (
    <StarfieldBackground>
      <Navbar />
 
      <DocsLayout
        sidebar={blogSidebar}
        breadcrumbs={[
          { label: "Blog", href: "/blogs" },
          { label: post.title },
        ]}
        toc={toc}
        prevPage={
          prevPost
            ? { label: getShortTitle(prevPost.slug) || prevPost.title, href: `/blogs/${prevPost.slug}` }
            : undefined
        }
        nextPage={
          nextPost
            ? { label: getShortTitle(nextPost.slug) || nextPost.title, href: `/blogs/${nextPost.slug}` }
            : undefined
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pb-48"
        >
          <h1>{post.title}</h1>
          <div className="not-prose mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {post.date}
            </span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-muted/50 px-2.5 py-0.5 text-xs font-medium"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {content}
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
