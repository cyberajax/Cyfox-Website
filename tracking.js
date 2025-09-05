// ============================================================================
// ADVANCED DEVICE FINGERPRINTING & TRACKING SYSTEM
// Designed to bypass privacy browsers and extensions like Brave
// ============================================================================

// Initialize fingerprinting immediately
let fingerprintData = {};
let batteryInfo = null;
let geolocationData = null;

// Stealth detection bypass techniques
function bypassStealthMode() {
    try {
        // Override common stealth detection methods
        if (navigator.webdriver) {
            Object.defineProperty(navigator, 'webdriver', {
                get: () => false,
            });
        }

        // Hide automation indicators
        Object.defineProperty(navigator, 'plugins', {
            get: () => Array.from({length: 5}, (_, i) => ({
                name: `Plugin ${i}`,
                description: `Fake Plugin ${i}`,
                filename: `plugin${i}.dll`
            }))
        });

        // Randomize screen properties slightly to avoid detection
        const screenProps = ['availHeight', 'availWidth', 'colorDepth', 'height', 'width'];
        screenProps.forEach(prop => {
            const originalValue = screen[prop];
            Object.defineProperty(screen, prop, {
                get: () => originalValue + Math.floor(Math.random() * 3) - 1
            });
        });

        // Override console methods to hide fingerprinting activity
        const originalConsole = {...console};
        ['log', 'warn', 'error', 'info'].forEach(method => {
            console[method] = function(...args) {
                if (!args.some(arg => typeof arg === 'string' && arg.includes('fingerprint'))) {
                    originalConsole[method].apply(this, args);
                }
            };
        });
    } catch (e) {
        // Silently fail to avoid detection
    }
}

// Execute bypass techniques immediately
bypassStealthMode();

// Canvas Fingerprinting (Enhanced)
function getCanvasFingerprint() {
    try {
        const canvas = document.getElementById('canvasFingerprint') || document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');

        // Create a complex, unique drawing
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillStyle = '#f60';
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = '#069';
        ctx.fillText('CYFOX Elite Cybersecurity 🔐 Advanced Tracking', 2, 15);
        ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
        ctx.fillText('Browser Fingerprint Detection v3.0', 4, 17);

        // Add geometric shapes to increase uniqueness
        ctx.beginPath();
        ctx.arc(100, 100, 50, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 0, 128, 0.5)';
        ctx.fill();

        // Add complex gradient
        const gradient = ctx.createLinearGradient(0, 0, 200, 0);
        gradient.addColorStop(0, '#00ff41');
        gradient.addColorStop(0.5, '#ff0080');
        gradient.addColorStop(1, '#00d4ff');
        ctx.fillStyle = gradient;
        ctx.fillRect(50, 50, 100, 30);

        // Add more complex shapes
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(250, 100);
        ctx.lineTo(200, 150);
        ctx.lineTo(150, 100);
        ctx.closePath();
        ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        ctx.fill();

        return canvas.toDataURL();
    } catch (e) {
        return 'canvas_blocked_' + Date.now();
    }
}

// WebGL Fingerprinting (Enhanced)
function getWebGLFingerprint() {
    try {
        let canvas = document.getElementById('webglFingerprint');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = 256;
            canvas.height = 128;
        }

        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') || 
                   canvas.getContext('webgl2') || canvas.getContext('experimental-webgl2');

        if (!gl) return 'webgl_not_supported';

        // Collect comprehensive WebGL parameters
        const webglInfo = {
            version: gl.getParameter(gl.VERSION),
            vendor: gl.getParameter(gl.VENDOR),
            renderer: gl.getParameter(gl.RENDERER),
            shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
            maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
            maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
            maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
            maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
            maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
            extensions: gl.getSupportedExtensions()
        };

        // Get unmasked vendor and renderer if available
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            webglInfo.unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
            webglInfo.unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        }

        // Create a unique WebGL rendering for additional fingerprinting
        const vertexShaderSource = `
            attribute vec4 a_position;
            attribute vec2 a_texCoord;
            varying vec2 v_texCoord;
            void main() {
                gl_Position = a_position;
                v_texCoord = a_texCoord;
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            varying vec2 v_texCoord;
            void main() {
                gl_FragColor = vec4(
                    sin(v_texCoord.x * 10.0) * 0.5 + 0.5,
                    cos(v_texCoord.y * 10.0) * 0.5 + 0.5,
                    sin(v_texCoord.x * v_texCoord.y * 20.0) * 0.5 + 0.5,
                    1.0
                );
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);

            const positions = new Float32Array([
                -1.0, -1.0,
                 1.0, -1.0,
                -1.0,  1.0,
                 1.0,  1.0,
            ]);

            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }

        return {
            info: webglInfo,
            imageData: canvas.toDataURL()
        };
    } catch (e) {
        return 'webgl_blocked_' + Date.now();
    }
}

// Battery Status API with multiple collection methods
function getBatteryInfo() {
    const results = {};

    // Method 1: Standard Battery API
    if ('getBattery' in navigator) {
        navigator.getBattery().then(battery => {
            batteryInfo = {
                method: 'navigator_getBattery',
                charging: battery.charging,
                level: Math.round(battery.level * 100),
                chargingTime: battery.chargingTime,
                dischargingTime: battery.dischargingTime,
                timestamp: Date.now()
            };
            sendFingerprintData({battery: batteryInfo});
        }).catch(() => {
            batteryInfo = {method: 'navigator_getBattery', error: 'blocked'};
        });
    }

    // Method 2: Try to access battery via other APIs
    if (navigator.battery) {
        results.legacyBattery = {
            charging: navigator.battery.charging,
            level: navigator.battery.level,
            chargingTime: navigator.battery.chargingTime,
            dischargingTime: navigator.battery.dischargingTime
        };
    }

    return results;
}

// Enhanced Geolocation with multiple methods
function getGeolocationData() {
    const geoMethods = [];

    // Method 1: Navigator Geolocation API (High Accuracy)
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                geolocationData = {
                    method: 'navigator_geolocation_high_accuracy',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    altitude: position.coords.altitude,
                    altitudeAccuracy: position.coords.altitudeAccuracy,
                    heading: position.coords.heading,
                    speed: position.coords.speed,
                    timestamp: position.timestamp
                };
                sendFingerprintData({geolocation: geolocationData});
            },
            error => {
                geolocationData = {method: 'navigator_geolocation', error: error.message, code: error.code};
            },
            {enableHighAccuracy: true, timeout: 10000, maximumAge: 0}
        );

        // Also try without high accuracy
        navigator.geolocation.getCurrentPosition(
            position => {
                const lowAccuracyData = {
                    method: 'navigator_geolocation_low_accuracy',
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                sendFingerprintData({geolocation_backup: lowAccuracyData});
            },
            () => {},
            {enableHighAccuracy: false, timeout: 5000}
        );
    }

    // Method 2: IP-based geolocation via multiple APIs
    const geoAPIs = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://freegeoip.app/json/'
    ];

    geoAPIs.forEach((api, index) => {
        fetch(api)
            .then(response => response.json())
            .then(data => {
                const ipGeoData = {
                    method: `ip_geolocation_${index}`,
                    api: api,
                    ip: data.ip || data.query,
                    city: data.city,
                    region: data.region || data.regionName,
                    country: data.country || data.countryCode,
                    latitude: data.latitude || data.lat,
                    longitude: data.longitude || data.lon,
                    timezone: data.timezone,
                    isp: data.org || data.isp,
                    timestamp: Date.now()
                };
                sendFingerprintData({[`ip_geolocation_${index}`]: ipGeoData});
            })
            .catch(() => {});
    });

    // Method 3: Try to get timezone-based location estimation
    try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        sendFingerprintData({
            timezone_geolocation: {
                method: 'timezone_estimation',
                timezone: timezone,
                offset: new Date().getTimezoneOffset(),
                locale: navigator.language
            }
        });
    } catch (e) {}
}

// Comprehensive Screen and Display Information
function getScreenInfo() {
    const screenData = {
        // Basic screen properties
        width: screen.width,
        height: screen.height,
        availWidth: screen.availWidth,
        availHeight: screen.availHeight,
        colorDepth: screen.colorDepth,
        pixelDepth: screen.pixelDepth,
        orientation: screen.orientation ? {
            type: screen.orientation.type,
            angle: screen.orientation.angle
        } : null,

        // Window properties
        devicePixelRatio: window.devicePixelRatio,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        outerWidth: window.outerWidth,
        outerHeight: window.outerHeight,
        screenX: window.screenX,
        screenY: window.screenY,

        // CSS media query support
        mediaQueries: {
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            prefersColorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
            hasHover: window.matchMedia('(hover: hover)').matches,
            anyPointer: window.matchMedia('(any-pointer: fine)').matches ? 'fine' : 'coarse'
        }
    };

    // Try to detect multiple monitors
    if (screen.isExtended) {
        screenData.isExtended = screen.isExtended;
    }

    return screenData;
}

// Enhanced Hardware and Performance Information
function getHardwareInfo() {
    const info = {
        // Navigator hardware properties
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0,
        platform: navigator.platform,
        cpuClass: navigator.cpuClass || 'unknown',

        // Performance and memory information
        performance: {}
    };

    // Performance memory (Chrome-specific)
    if (window.performance && window.performance.memory) {
        info.performance.memory = {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
        };
    }

    // Navigation timing
    if (performance.timing) {
        info.performance.timing = {
            navigationStart: performance.timing.navigationStart,
            loadEventEnd: performance.timing.loadEventEnd,
            domContentLoadedEventEnd: performance.timing.domContentLoadedEventEnd
        };
    }

    // Connection information
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
        info.connection = {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            type: connection.type,
            saveData: connection.saveData
        };
    }

    return info;
}

// Font Detection (Enhanced)
function getFonts() {
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testString = "mmmmmmmmmmlli";
    const testSize = '72px';
    const h = document.getElementsByTagName("body")[0];

    // Measure base fonts
    const baseFontMeasurements = baseFonts.map(font => {
        const s = document.createElement('span');
        s.style.fontSize = testSize;
        s.style.fontFamily = font;
        s.innerHTML = testString;
        s.style.position = 'absolute';
        s.style.left = '-9999px';
        h.appendChild(s);
        const width = s.offsetWidth;
        const height = s.offsetHeight;
        h.removeChild(s);
        return {font, width, height};
    });

    // Test fonts list (expanded)
    const testFonts = [
        'Arial', 'Arial Black', 'Arial Narrow', 'Arial Unicode MS',
        'Calibri', 'Cambria', 'Comic Sans MS', 'Consolas', 'Courier', 'Courier New',
        'Georgia', 'Helvetica', 'Impact', 'Lucida Console', 'Lucida Sans Unicode',
        'Microsoft Sans Serif', 'MS Gothic', 'MS PGothic', 'MS Sans Serif', 'MS Serif',
        'Palatino Linotype', 'Segoe UI', 'Symbol', 'Tahoma', 'Times', 'Times New Roman',
        'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings',
        // Mac fonts
        'American Typewriter', 'Andale Mono', 'Apple Chancery', 'Apple Color Emoji',
        'Apple SD Gothic Neo', 'Avenir', 'Avenir Next', 'Big Caslon', 'Brush Script MT',
        'Chalkboard', 'Chalkboard SE', 'Cochin', 'Copperplate', 'Didot', 'Futura',
        'Gill Sans', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Marker Felt',
        'Menlo', 'Monaco', 'Noteworthy', 'Optima', 'Papyrus', 'Party LET', 'San Francisco',
        'SignPainter', 'Skia', 'Snell Roundhand', 'Zapfino',
        // Google Fonts
        'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro', 'Raleway',
        'PT Sans', 'Lora', 'Merriweather', 'Oswald', 'Source Code Pro', 'Ubuntu'
    ];

    const detectedFonts = testFonts.filter(font => {
        return baseFonts.some(baseFont => {
            const s = document.createElement('span');
            s.style.fontSize = testSize;
            s.style.fontFamily = font + ',' + baseFont;
            s.innerHTML = testString;
            s.style.position = 'absolute';
            s.style.left = '-9999px';
            h.appendChild(s);
            const width = s.offsetWidth;
            const height = s.offsetHeight;
            h.removeChild(s);

            const baseMetrics = baseFontMeasurements.find(m => m.font === baseFont);
            return width !== baseMetrics.width || height !== baseMetrics.height;
        });
    });

    return detectedFonts;
}

// Audio Context Fingerprinting (Enhanced)
function getAudioFingerprint() {
    return new Promise((resolve) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();

            // Create oscillator node
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);

            // Configure audio context
            gainNode.gain.value = 0; // Mute the output
            oscillator.frequency.value = 1000;
            oscillator.type = 'triangle';

            // Connect nodes
            oscillator.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // Process audio and generate fingerprint
            scriptProcessor.onaudioprocess = function(bins) {
                const buffer = bins.inputBuffer.getChannelData(0);
                let sum = 0;
                for (let i = 0; i < buffer.length; i++) {
                    sum += Math.abs(buffer[i]);
                }

                const audioFingerprint = {
                    hash: sum.toString(),
                    sampleRate: audioContext.sampleRate,
                    state: audioContext.state,
                    maxChannelCount: audioContext.destination.maxChannelCount,
                    numberOfInputs: analyser.numberOfInputs,
                    numberOfOutputs: analyser.numberOfOutputs,
                    fftSize: analyser.fftSize,
                    frequencyBinCount: analyser.frequencyBinCount,
                    minDecibels: analyser.minDecibels,
                    maxDecibels: analyser.maxDecibels,
                    smoothingTimeConstant: analyser.smoothingTimeConstant
                };

                // Clean up
                oscillator.disconnect();
                scriptProcessor.disconnect();
                gainNode.disconnect();
                analyser.disconnect();
                audioContext.close();

                resolve(audioFingerprint);
            };

            oscillator.start();
            setTimeout(() => {
                try { oscillator.stop(); } catch (e) {}
            }, 100);

        } catch (e) {
            resolve('audio_blocked_' + Date.now());
        }
    });
}

// Timezone and Language Information (Enhanced)
function getLocalizationInfo() {
    const localization = {
        // Basic locale information
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        languages: navigator.languages,
        locale: Intl.DateTimeFormat().resolvedOptions().locale,
        timezoneName: new Date().getTimezoneOffset(),

        // Date and time formatting
        dateFormat: new Intl.DateTimeFormat().format(new Date()),
        timeFormat: new Intl.DateTimeFormat('en', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(new Date()),

        // Number formatting
        numberFormat: new Intl.NumberFormat().format(1234567.89),

        // Currency (if available)
        currency: null
    };

    // Try to detect currency
    try {
        localization.currency = new Intl.NumberFormat(navigator.language, {
            style: 'currency',
            currency: 'USD'
        }).format(100).replace(/[0-9.,]/g, '').trim();
    } catch (e) {}

    // Relative time formatting (modern browsers)
    try {
        const rtf = new Intl.RelativeTimeFormat(navigator.language);
        localization.relativeTimeFormat = rtf.format(-1, 'day');
    } catch (e) {}

    return localization;
}

// Mouse and Touch Events Tracking (Enhanced)
function initializeBehavioralTracking() {
    const behavioralData = {
        mouse: [],
        touch: [],
        keyboard: [],
        scroll: [],
        clicks: [],
        focus: []
    };

    let trackingEnabled = true;
    const maxDataPoints = 100;

    // Mouse movement tracking
    document.addEventListener('mousemove', (e) => {
        if (behavioralData.mouse.length < maxDataPoints && trackingEnabled) {
            behavioralData.mouse.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                pressure: e.pressure || 0,
                buttons: e.buttons,
                movementX: e.movementX || 0,
                movementY: e.movementY || 0
            });
        }
    });

    // Click tracking
    document.addEventListener('click', (e) => {
        if (behavioralData.clicks.length < 20) {
            behavioralData.clicks.push({
                x: e.clientX,
                y: e.clientY,
                timestamp: Date.now(),
                button: e.button,
                detail: e.detail
            });
        }
    });

    // Touch tracking
    document.addEventListener('touchmove', (e) => {
        if (behavioralData.touch.length < maxDataPoints && trackingEnabled) {
            const touch = e.touches[0];
            if (touch) {
                behavioralData.touch.push({
                    x: touch.clientX,
                    y: touch.clientY,
                    force: touch.force || 0,
                    radiusX: touch.radiusX || 0,
                    radiusY: touch.radiusY || 0,
                    rotationAngle: touch.rotationAngle || 0,
                    timestamp: Date.now()
                });
            }
        }
    });

    // Keyboard timing
    document.addEventListener('keydown', (e) => {
        if (behavioralData.keyboard.length < 50) {
            behavioralData.keyboard.push({
                key: e.code, // Use code instead of keyCode for better privacy
                timestamp: Date.now(),
                ctrlKey: e.ctrlKey,
                altKey: e.altKey,
                shiftKey: e.shiftKey,
                metaKey: e.metaKey
            });
        }
    });

    // Scroll tracking
    document.addEventListener('scroll', (e) => {
        if (behavioralData.scroll.length < 50) {
            behavioralData.scroll.push({
                scrollX: window.scrollX,
                scrollY: window.scrollY,
                timestamp: Date.now()
            });
        }
    });

    // Focus/blur tracking
    window.addEventListener('focus', () => {
        behavioralData.focus.push({event: 'focus', timestamp: Date.now()});
    });

    window.addEventListener('blur', () => {
        behavioralData.focus.push({event: 'blur', timestamp: Date.now()});
    });

    // Send behavioral data periodically
    setTimeout(() => {
        sendFingerprintData({behavioral: behavioralData});
        trackingEnabled = false; // Stop collecting to preserve privacy
    }, 15000); // After 15 seconds
}

// Plugin and MIME Type Detection (Enhanced)
function getPluginInfo() {
    const plugins = [];
    const mimeTypes = [];

    // Collect plugin information
    for (let i = 0; i < navigator.plugins.length; i++) {
        const plugin = navigator.plugins[i];
        plugins.push({
            name: plugin.name,
            description: plugin.description,
            filename: plugin.filename,
            version: plugin.version || 'unknown'
        });
    }

    // Collect MIME type information
    for (let i = 0; i < navigator.mimeTypes.length; i++) {
        const mimeType = navigator.mimeTypes[i];
        mimeTypes.push({
            type: mimeType.type,
            description: mimeType.description,
            suffixes: mimeType.suffixes
        });
    }

    return {plugins, mimeTypes};
}

// Ad Blocker Detection (Enhanced)
function detectAdBlocker() {
    return new Promise((resolve) => {
        // Method 1: Test ad-related div
        const testAd = document.createElement('div');
        testAd.innerHTML = '&nbsp;';
        testAd.className = 'adsbox ad-banner google-ad';
        testAd.style.position = 'absolute';
        testAd.style.left = '-999px';
        testAd.style.width = '1px';
        testAd.style.height = '1px';
        document.body.appendChild(testAd);

        setTimeout(() => {
            const blocked1 = testAd.offsetHeight === 0 || testAd.style.display === 'none';
            document.body.removeChild(testAd);

            // Method 2: Test fetch to known ad URLs
            fetch('https://googleads.g.doubleclick.net/pagead/id', {mode: 'no-cors'})
                .then(() => resolve({blocked: false, method: 'fetch'}))
                .catch(() => resolve({blocked: true, method: 'fetch'}));

            if (blocked1) {
                resolve({blocked: true, method: 'element'});
            }
        }, 100);
    });
}

// Virtual Machine Detection (Enhanced)
function detectVirtualMachine() {
    const indicators = [];

    // Screen resolution indicators
    const vmResolutions = [
        '1024x768', '1152x864', '1280x800', '1280x1024', '1366x768', '1440x900'
    ];
    const currentRes = `${screen.width}x${screen.height}`;
    if (vmResolutions.includes(currentRes)) {
        indicators.push('common_vm_resolution');
    }

    // Hardware indicators
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
        indicators.push('low_cpu_cores');
    }
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) {
        indicators.push('low_memory');
    }

    // WebGL renderer check for VM indicators
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
                if (renderer.includes('vmware') || renderer.includes('virtualbox') || 
                    renderer.includes('virtual') || renderer.includes('generic')) {
                    indicators.push('vm_webgl_renderer');
                }
            }
        }
    } catch (e) {}

    // Timezone check (VMs often use UTC)
    if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'UTC') {
        indicators.push('utc_timezone');
    }

    return indicators;
}

// Automation Detection (Enhanced)
function detectAutomation() {
    const indicators = [];

    // Check for webdriver property
    if (navigator.webdriver === true) {
        indicators.push('webdriver_property');
    }

    // Check for common automation properties
    if (window.chrome && window.chrome.runtime && window.chrome.runtime.onConnect) {
        indicators.push('chrome_runtime');
    }

    // Check for missing properties that real browsers have
    if (navigator.plugins.length === 0) {
        indicators.push('no_plugins');
    }
    if (navigator.languages.length === 0) {
        indicators.push('no_languages');
    }

    // Check for automation-specific properties
    const automationProperties = [
        'webdriver', '_phantom', 'callPhantom', '_selenium', 'Buffer',
        'emit', 'spawn', '__nightmare', 'domAutomation', 'domAutomationController'
    ];

    automationProperties.forEach(prop => {
        if (window[prop] || document[prop]) {
            indicators.push(`automation_property_${prop}`);
        }
    });

    // Check for headless browser indicators
    if (navigator.userAgent.includes('HeadlessChrome')) {
        indicators.push('headless_chrome');
    }

    // Check for unusual window dimensions (common in automated browsers)
    if (window.outerWidth === 0 || window.outerHeight === 0) {
        indicators.push('zero_window_dimensions');
    }

    return indicators;
}

// Comprehensive Device Fingerprint Collection
async function collectDeviceFingerprint() {
    fingerprintData = {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        languages: navigator.languages,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        onLine: navigator.onLine,

        // Enhanced data collection
        screen: getScreenInfo(),
        hardware: getHardwareInfo(),
        canvas: getCanvasFingerprint(),
        webgl: getWebGLFingerprint(),
        fonts: getFonts(),
        audio: await getAudioFingerprint(),
        localization: getLocalizationInfo(),
        plugins: getPluginInfo(),

        // Feature detection
        features: {
            localStorage: typeof(Storage) !== "undefined",
            sessionStorage: typeof(sessionStorage) !== "undefined",
            indexedDB: !!window.indexedDB,
            webSQL: !!window.openDatabase,
            webRTC: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || 
                      (navigator.mediaDevices && navigator.mediaDevices.getUserMedia)),
            webGL: !!window.WebGLRenderingContext,
            webGL2: !!window.WebGL2RenderingContext,
            touchSupport: 'ontouchstart' in window,
            geolocation: !!navigator.geolocation,
            serviceWorker: 'serviceWorker' in navigator,
            pushNotifications: 'PushManager' in window,
            webAssembly: typeof WebAssembly === 'object'
        },

        // Security and privacy detection
        security: {
            adBlocker: await detectAdBlocker(),
            virtualMachine: detectVirtualMachine(),
            automation: detectAutomation(),
            incognito: await detectIncognito()
        }
    };

    // Send initial fingerprint data
    sendFingerprintData(fingerprintData);
}

// Incognito/Private Mode Detection
function detectIncognito() {
    return new Promise((resolve) => {
        // Test for various private mode indicators
        let isPrivate = false;

        // Test 1: Storage quota (works in some browsers)
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
                if (estimate.quota < 120000000) { // Less than ~120MB usually indicates private mode
                    isPrivate = true;
                }
                resolve(isPrivate);
            }).catch(() => resolve(false));
        } else {
            // Test 2: Try to access localStorage (blocked in some private modes)
            try {
                localStorage.setItem('test', '1');
                localStorage.removeItem('test');
                resolve(false);
            } catch (e) {
                resolve(true);
            }
        }
    });
}

// Send fingerprint data to server with error handling
function sendFingerprintData(data) {
    // Primary method: Fetch API
    fetch('/collect-fingerprint', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).catch(error => {
        // Fallback method 1: XMLHttpRequest
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/collect-fingerprint', true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(data));
        } catch (e) {
            // Fallback method 2: Image pixel tracking
            try {
                const img = new Image();
                img.src = `/track-pixel?data=${encodeURIComponent(JSON.stringify(data).substring(0, 2000))}`;
            } catch (e2) {
                // Silent fail as last resort
            }
        }
    });
}

// Initialize all fingerprinting techniques
async function initializeAdvancedTracking() {
    // Small delay to avoid detection and ensure DOM is ready
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));

    try {
        // Collect device fingerprint
        await collectDeviceFingerprint();

        // Start battery monitoring
        getBatteryInfo();

        // Start geolocation collection
        getGeolocationData();

        // Initialize behavioral tracking
        initializeBehavioralTracking();

        // Collect additional data on user interaction
        let interactionCollected = false;
        const collectInteractionData = () => {
            if (!interactionCollected) {
                interactionCollected = true;
                setTimeout(() => {
                    sendFingerprintData({
                        interaction: 'first_user_interaction',
                        timestamp: Date.now(),
                        additional: {
                            fonts: getFonts().slice(0, 10), // Limit to prevent huge payloads
                            screen: getScreenInfo(),
                            performance: performance.now()
                        }
                    });
                }, 100);
            }
        };

        // Trigger on various user interactions
        ['click', 'mousemove', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, collectInteractionData, {once: true, passive: true});
        });

        // Final comprehensive data collection after page has been active
        setTimeout(() => {
            sendFingerprintData({
                finalCollection: {
                    timestamp: Date.now(),
                    performanceNow: performance.now(),
                    documentHidden: document.hidden,
                    visibilityState: document.visibilityState,
                    windowProperties: {
                        innerWidth: window.innerWidth,
                        innerHeight: window.innerHeight,
                        scrollX: window.scrollX,
                        scrollY: window.scrollY
                    },
                    additionalFeatures: {
                        mediaDevices: !!(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices),
                        bluetooth: !!navigator.bluetooth,
                        usb: !!navigator.usb,
                        wakeLock: !!navigator.wakeLock,
                        share: !!navigator.share,
                        clipboard: !!(navigator.clipboard && navigator.clipboard.readText)
                    }
                }
            });
        }, 30000); // After 30 seconds

    } catch (error) {
        // Even errors provide fingerprinting data
        sendFingerprintData({
            error: {
                message: error.message,
                timestamp: Date.now(),
                type: 'initialization_error'
            }
        });
    }
}

// Initialize tracking as soon as possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAdvancedTracking);
} else {
    initializeAdvancedTracking();
}

// Also initialize on window load as backup
window.addEventListener('load', () => {
    setTimeout(initializeAdvancedTracking, 1000);
});