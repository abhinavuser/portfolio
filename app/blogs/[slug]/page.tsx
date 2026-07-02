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
        cubemx is a code generation tool. you pick your chip, configure peripherals in a gui, and it spits out a project. fast to start, genuinely useful for complex peripheral setups, and it produces correct code.
      </p>
      <p>
        but it generates these files silently:
      </p>
      <ul>
        <li><code>startup_stm32f303x8.s</code> — assembly that runs before your main()</li>
        <li><code>STM32F303K8_FLASH.ld</code> — the linker script that tells gcc where flash and ram are</li>
        <li><code>system_stm32f3xx.c</code> — clock initialisation</li>
        <li><code>FreeRTOSConfig.h</code> — every single rtos behavioural parameter</li>
        <li>the entire makefile / cmake setup</li>
      </ul>
      <p>
        when you don't write these yourself, you don't know what they do. and when something goes wrong at the hardware level — wrong interrupt priority, stack overflow, hard fault on scheduler start — you're debugging files you've never read. not a great place to be. doing it manually means you own every file.
      </p>

      <h2 id="the-hardware">the hardware: stm32f303k8 nucleo</h2>
      <p>
        the board i used is the nucleo-f303k8. small, cheap, and brutal in the best way — the chip has:
      </p>
      <ul>
        <li>arm cortex-m4f core (the F means hardware floating point unit)</li>
        <li>64 kb flash at <code>0x08000000</code></li>
        <li>12 kb sram at <code>0x20000000</code></li>
        <li>4 kb ccm (core coupled memory — fast, cpu-only access)</li>
        <li>gpio on the ahb2 bus at <code>0x48000000</code></li>
        <li>rcc (clock controller) at <code>0x40021000</code></li>
        <li>user led (ld3) on <strong>pb3</strong></li>
      </ul>
      <p>
        that last point — gpio on ahb2 — is the thing that breaks every tutorial written for the f4. the f4 has gpio on ahb1 (<code>0x40020000</code>). the f3 doesn't.
      </p>

      <h2 id="the-toolchain">the toolchain: what you actually install and why</h2>
      <p>
        four things. that's it.
      </p>
      <ul>
        <li><strong>arm-none-eabi-gcc</strong> — the cross compiler.</li>
        <li><strong>make</strong> — the build system.</li>
        <li><strong>openocd</strong> — open on-chip debugger. talks to the st-link over usb.</li>
        <li><strong>vs code + cortex-debug</strong> — optional but seriously useful.</li>
      </ul>
      <pre><code className="language-bash">{`arm-none-eabi-gcc --version
openocd --version`}</code></pre>

      <h2 id="the-project">the project structure, file by file</h2>
      <p>
        let's go through each one properly.
      </p>

      <h3 id="startup-assembly">startup_stm32f303x8.s — what runs before main()</h3>
      <p>
        the cpu jumps to an address it reads from the <strong>vector table</strong> — a table of function pointers at the very start of flash. the reset handler does three things before calling your code:
      </p>
      <ol>
        <li>copies .data from flash to ram</li>
        <li>zeroes out .bss</li>
        <li>calls SystemInit() then main()</li>
      </ol>

      <h3 id="linker-script">STM32F303K8_FLASH.ld — the linker script</h3>
      <p>
        this file tells gcc the physical memory layout of your chip:
      </p>
      <pre><code className="language-ld">{`MEMORY {
  FLASH (rx)  : ORIGIN = 0x08000000, LENGTH = 64K
  RAM   (rwx) : ORIGIN = 0x20000000, LENGTH = 12K
  CCMRAM (rwx): ORIGIN = 0x10000000, LENGTH = 4K
}`}</code></pre>

      <h3 id="register-definitions">stm32f303k8.h — register definitions</h3>
      <p>
        instead of writing raw pointers like <code>*((volatile uint32_t*)0x48000400) |= (1 &lt;&lt; 6);</code>, you write <code>GPIOB-&gt;MODER |= (1 &lt;&lt; 6);</code>.
      </p>

      <h3 id="freertos-config">FreeRTOSConfig.h — the rtos brain</h3>
      <p>
        the three lines most tutorials skip that cause mysterious hard faults:
      </p>
      <pre><code className="language-c">{`#define vPortSVCHandler     SVC_Handler
#define xPortPendSVHandler  PendSV_Handler
#define xPortSysTickHandler SysTick_Handler`}</code></pre>
      <p>
        freertos uses these three arm exceptions to implement its scheduler. without mapping them, the scheduler starts and hard faults immediately.
      </p>

      <h3 id="board-c">board.c — gpio without hal</h3>
      <pre><code className="language-c">{`// step 1: enable gpiob clock on ahb2
RCC->AHBENR |= RCC_AHBENR_GPIOBEN;

// step 2: set pb3 as output
GPIOB->MODER &= ~(3U << 6);   // clear bits 7:6
GPIOB->MODER |=  (1U << 6);   // set 01 = output

// step 3: toggle
GPIOB->ODR ^= (1U << 3);`}</code></pre>

      <h3 id="freertos-app">freertos_app.c — two tasks, one queue</h3>
      <pre><code className="language-c">{`static QueueHandle_t xQueue;

void vLEDTask(void *pvParams) {
    uint32_t count = 0;
    board_led_init();

    for(;;) {
        board_led_toggle();
        xQueueSend(xQueue, &count, 0);
        count++;
        vTaskDelay(pdMS_TO_TICKS(500));   // yields for 500ms
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

      <h2 id="the-bugs">the bugs — this is the real content</h2>
      <p>
        none of these are in any tutorial. they're all things you only hit when you do it yourself.
      </p>
      <h3 id="bug-linker">bug: linker script missing .init section</h3>
      <p>
        <strong>symptom:</strong> linker error about overlapping sections when building with freertos.<br/>
        <strong>cause:</strong> newlib uses a <code>.init</code> section. our linker script didn't account for it.<br/>
        <strong>fix:</strong> add <code>.init</code> and <code>.fini</code> sections explicitly in the linker script.
      </p>

      <h2 id="how-freertos-runs">how freertos actually runs on this chip</h2>
      <p>
        the scheduler works through three arm exceptions:
      </p>
      <ul>
        <li><strong>systick</strong> fires every 1ms.</li>
        <li><strong>pendsv</strong> is where the actual context switch happens (saving and restoring registers).</li>
        <li><strong>svc</strong> is used exactly once — to start the first task.</li>
      </ul>

      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        everything's at <a href="https://github.com/abhinavuser/freertos-from-scratch" target="_blank" className="text-primary hover:underline">github.com/abhinavuser/freertos-from-scratch</a>. do it the hard way once. then cubemx makes sense, because you know what it's generating.
      </p>
    </>
  ),

  "toy-nn-runtime": (
    <>
      <h2 id="motivation">motivation</h2>
      <p>
        after spending months working with tflite, rknn, and armnn runtimes, i wanted to understand what actually goes on under the hood. the best way to learn? build one myself in c++. the goal wasn&apos;t to compete with production tools, it was purely to understand memory management, operator dispatching, tensor layout, and graph execution.
      </p>

      <h2 id="architecture">architecture</h2>
      <p>i designed a simple three-layer architecture to keep the abstraction clean:</p>
      <ol>
        <li><strong>graph parser</strong>: reads a simplified json model format that describes the node connections and weights.</li>
        <li><strong>operator registry</strong>: a mapping system (using function pointers and polymorphism) to route operators like <code>Conv2D</code> to their c++ implementations.</li>
        <li><strong>executor</strong>: walks the graph in topological order, allocates memory, and dispatches the math.</li>
      </ol>

      <h2 id="tensor">the tensor class</h2>
      <p>
        the tensor class is the heart of any runtime. memory layout (nchw vs nhwc) has a massive impact on cache performance. i implemented a basic n-dimensional tensor tracking its shape dynamically:
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
        the core math operations. i started with a naive <code>Conv2D</code> with nested loops. it is o(n*k*k*c_in*c_out) which is horrendous for performance, but the math is beautifully simple:
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

      <h2 id="memory-management">memory management</h2>
      <p>
        allocating and freeing vectors dynamically on every inference step destroys performance. to fix this, i implemented a basic arena allocator. the runtime pre-calculates the maximum memory required for any two layers during the topological sort, allocates one huge buffer, and ping-pongs between offsets during execution.
      </p>

      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        it successfully ran a simple mnist classifier. performance was about 100x slower than tflite because i didn&apos;t use simd instructions, thread pools, or operator fusion (combining conv + relu into one pass). but seeing the raw floating-point math work end-to-end taught me more about machine learning than any high-level keras tutorial ever did.
      </p>
    </>
  ),

  "xiao-esp32s3-rtsp-stream": (
    <>
      <h2 id="overview">overview</h2>
      <p>
        the seeed studio xiao esp32s3 sense is ridiculously small—barely larger than a thumb—yet it packs wifi, ble, a microsd slot, and an ov2640 camera module. i wanted to use it as a tiny hidden ip camera, and the easiest, most widely supported way to stream video over a local network is rtsp (real time streaming protocol).
      </p>

      <h2 id="setup">prerequisites and setup</h2>
      <p>
        i used platformio for this because the arduino ide gets messy fast. you need the <code>esp32</code> platform installed and the board set to <code>seeed_xiao_esp32s3</code>. the magic happens using the <code>Micro-RTSP</code> library, which handles wrapping the jpeg frames into rtp packets over udp/tcp without us having to write the socket logic from scratch.
      </p>

      <h2 id="camera-config">camera initialization</h2>
      <p>
        the most annoying part of any esp32 camera project is getting the pinout right. the xiao has a custom camera board, so standard esp32-cam pinouts will not work and will crash the i2c bus. here is the exact, tested config for the ov2640 on the xiao:
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
config.fb_count = 2; // dual buffering for smooth streaming`}</code></pre>

      <h2 id="the-stream">starting the stream</h2>
      <p>
        once the camera is initialized and wifi is connected (ideally with a static ip so you don&apos;t have to hunt for it), we instantiate the rtsp server on port 8554. in the main loop, we just grab frames and feed them into the broadcast buffer.
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

      <h2 id="performance">thermal management</h2>
      <p>
        this board gets insanely hot. pushing vga frames at 20fps over wifi continuously means the esp32 is running near max power draw. if you enclose this in a 3d printed case without ventilation, it will thermal throttle or completely crash within 10 minutes. i recommend adding a tiny 10x10mm heatsink to the metal shield and dropping the framerate if continuous 24/7 streaming is required.
      </p>

      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        to view the stream, open vlc media player, go to network stream, and enter <code>rtsp://[xiao_ip]:8554/mjpeg/1</code>. latency hovers around 200ms on a good 2.4ghz router, which is incredibly impressive for a $10 microcontroller smaller than a coin.
      </p>
    </>
  ),

  "rpi4-1d-cnn": (
    <>
      <h2 id="context">the context</h2>
      <p>
        when people talk about convolutional neural networks (cnns), they almost always mean 2d cnns processing images (like classifying cats vs dogs). but cnns are mathematically just sliding filters. if you use a 1-dimensional filter, they become incredibly powerful tools for time-series data—accelerometers, gyroscopes, audio waveforms, or ecg signals. 1d cnns are significantly lighter, faster, and often more robust than recurrent networks like lstms.
      </p>

      <h2 id="dataset">windowing the data</h2>
      <p>
        you can't just feed raw continuous data into a network. you have to slice it into overlapping windows. if you sample an imu at 100hz, a 2-second window gives you 200 samples. if you have x, y, and z axes, your input shape becomes <code>(200, 3)</code>. this is the fundamental input block for the model.
      </p>

      <h2 id="the-model">building the model</h2>
      <p>
        training is done offline on a pc using keras. it looks remarkably similar to an image model, just with <code>Conv1D</code> instead of <code>Conv2D</code>.
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
        once trained and achieving high accuracy on the validation set, you export it to a <code>.tflite</code> file. this strips out the training nodes and drastically reduces the file size.
      </p>

      <h2 id="deployment">deploying on the pi</h2>
      <p>
        you do not want to run <code>pip install tensorflow</code> on a raspberry pi. it brings in massive dependencies, runs slowly, and eats ram. instead, you only install the <code>tflite-runtime</code>.
      </p>
      <pre><code className="language-bash">{`pip3 install tflite-runtime numpy`}</code></pre>

      <h2 id="inference">threaded inference</h2>
      <p>
        the trick to real-time embedded ai is making sure your inference doesn't block your sensor reading. if inference takes 5ms, and you read sensors in the same loop, your sensor timing will jitter. i used python's <code>threading</code> module: one thread constantly reads the i2c sensor into a circular buffer, and the main thread periodically grabs a copy of that buffer to run inference.
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

      <h2 id="final-thoughts">final thoughts</h2>
      <p>
        on the raspberry pi 4b cpu, a forward pass of this model takes roughly 1.5 milliseconds. this means you can comfortably classify high-frequency machinery vibrations or gestures hundreds of times per second with virtually zero cpu load. it proves that you don't always need an edge tpu or neural stick to do serious local ai.
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
