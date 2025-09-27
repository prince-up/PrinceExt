(() => {
  let tabs,
    tabContent,
    isDeleteMode = false;

  const FALLBACK_ICON_SVG =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzU0NmU3YSI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTggMTBjMCAxLjEtLjIgMi4xMi0uNTcgMy4wN0wxNC4yNSAxMS45bDIuODIgMi44Mi4wNy4wN2MyLjE4LTIuNC43OC02LjA0LTEuNzQtNy41NVM5LjI5IDQuNDYgNi44OSA2LjY0bC4wOC4wNyAyLjgyIDIuODFMMi45MyAxNC40M0E4LjkzMiA4LjkzMiAwIDAgMSAyIDEyYz4.4yAzLjU4LTggOC04czggMy41OCA4IDh6Ii8+PC9zdmc+";

  const saveState = () => {
    if (chrome && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(
        {
          webhub_tabs_v1: tabs,
          webhub_tabContent_v1: tabContent,
        },
        () => {
          if (chrome.runtime.lastError)
            console.error(
              "PrinceExt Error: Failed to save state.",
              chrome.runtime.lastError
            );
        }
      );
    }
  };

  const initializeDefaultState = () => {
    tabs = [
      "AI Tools",
      "Coding",
      "OpenSource",
      "Social",
      "Entertainment",
      "DataBase",
    ];
    tabContent = {
      "AI Tools": [
        {
          name: "ChatGPT",
          url: "https://chat.openai.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/openai.png",
        },
        {
          name: "DeepSeek",
          url: "https://chat.deepseek.com/",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/dark/deepseek-color.png",
        },
        {
          name: "Perplexity",
          url: "https://www.perplexity.ai",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/perplexity.png",
        },
        {
          name: "Claude",
          url: "https://claude.ai/new",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/claude-color.png",
        },
        {
          name: "Gemini",
          url: "https://gemini.google.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/gemini-color.png",
        },
        {
          name: "Grok",
          url: "https://www.grok.com",
          icon: "https://registry.npmmirror.com/@lobehub/icons-static-png/1.60.0/files/light/grok.png",
        },
      ],
      Coding: [
        {
          name: "LeetCode",
          url: "https://leetcode.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/1/19/LeetCode_logo_black.png",
        },
        {
          name: "Codeforces",
          url: "https://codeforces.com",
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACUCAMAAAAj+tKkAAAAnFBMVEX///9PgcH/1ACuDwrt8fdLfsBpkMj//PX/1jqtAwD69fWzOzvK1un/8L//9dXy4uL/1im3QkHjwL+Trtb/0ADX4O+ft9r19/s2c7tBeb67zORaiMR2ms2mAAD/2ELqz8//++z/4nr37Oz/88v/+eL/6qT/3GL/5Yr/55b/21ffs7PHenm6U1OzLCqwHRvUmJe/X1/GbWzPi4raqKdO0TxAAAACN0lEQVR4nO3ca1OCQBTG8TW8rWWlkJqKKN5SSDS//3cLoXFq2suZ2alDzfN/jcNvzoKv2BUCIYQQQuiHqz/dKXuqc8uK6n6z1lBWa/oVIA5GuURTozEaMPOG/kinKxv5Q1ag/2z21WrPPqdvbJlfMcMxn2840T5+nx7ECd8ij60LXCwy3wjtT2ABZHsKh1PCCudrPOVa43qTBmxy/V0DCCCAAAIIIIAAAggggH8G2FrdK1tVBLjezB6VzTbrCgC7wY2+IOhyA7cGXtGCF7g1za/shRPYtfLylKv8O8DWjgJs8wGX9gXOU74ovwO0viFlGzZgmwacsQFpvpt2C0AAAQQQQAArCYwflMUVAe6TtKcsTfYVAEavodR3iLiBmZSeISkzXuA5NPpyYZhxAvuexXeZYcQITK2+XHjssAGj0O7zvDBiA54IA8xH+MYG7NGAPS5g55YE9DwAAQQQQAABBBBAAAEEEEAAAQQQQAABBBBAAAEEEEAAAQQQQAABBPB/Ah+JwO/3cDvGgAaUr2JBA+4U33A6COJIAybm3TjXAuXGIZejNPa0D3v6Yj4jTVB1D7fDSA6UT6N6sRBrygg1O69cjnM5E0YYni9Xbuw+zaYmtwNxEqtQnsorbcJAtZmkzOlIoZNFGH74ROvFuMrBVvEfeM3hUKZOdvlCVDM8KcOsc710tdC+KruFaXOicDvWKk7Sg+YD1vTt4cul82VX2XJuvkVBdDgYLI76yqLY/luEEEIIISHeAWxkhFCi17KTAAAAAElFTkSuQmCC",
        },
        {
          name: "HackerRank",
          url: "https://www.hackerrank.com",
          icon: "https://upload.wikimedia.org/wikipedia/commons/6/65/HackerRank_logo.png",
        },
        {
          name: "CodeChef",
          url: "https://www.codechef.com",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4CHTzdlZAsS_9wR7mXJuQKZeqGH1jaS4tLw&s",
        },
        {
          name: "GeeksforGeeks",
          url: "https://www.geeksforgeeks.org",
          icon: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
        },
        {
          name: "Exercism",
          url: "https://exercism.org",
          icon: "data:image/png;base64,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",
        },
        {
          name: "W3Schools",
          url: "https://www.w3schools.com",
          icon: "data:image/png;base64,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",
        },
      ],
      OpenSource: [
        {
          name: "GitHub",
          url: "https://github.com",
          icon: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
        },
        {
          name: "Stack Overflow",
          url: "https://stackoverflow.com",
          icon: "https://cdn-icons-png.flaticon.com/512/2111/2111628.png",
        },
        {
          name: "SourceForge",
          url: "https://sourceforge.net",
          icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIKTr3PXDrlyqSD3sICodXs36SpIUK9XsoxUn3lW50-HwFoC70Q1QCScdGyg4Gnl5PLCA&usqp=CAU",
        },
        {
          name: "MDN Web Docs",
          url: "https://developer.mozilla.org/en-US/",
          icon: "https://www.mozilla.org/media/img/logos/mdn/mdn.7107c1341a99.svg",
        },
      ],
      Social: [
        {
          name: "LinkedIn",
          url: "https://linkedin.com",
          icon: "https://cdn-icons-png.flaticon.com/128/145/145807.png",
        },
        {
          name: "WhatsApp",
          url: "https://www.whatsapp.com",
          icon: "https://cdn-icons-png.flaticon.com/128/15707/15707820.png",
        },
        {
          name: "Facebook",
          url: "https://facebook.com",
          icon: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
        },
        {
          name: "Instagram",
          url: "https://instagram.com",
          icon: "https://cdn-icons-png.flaticon.com/128/15707/15707749.png",
        },
        {
          name: "Threads",
          url: "https://www.threads.net",
          icon: "https://cdn-icons-png.flaticon.com/128/12105/12105338.png",
        },
        {
          name: "Twitter",
          url: "https://twitter.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670151.png",
        },
        {
          name: "Snapchat",
          url: "https://snapchat.com",
          icon: "https://cdn-icons-png.flaticon.com/128/15707/15707784.png",
        },
        {
          name: "Reddit",
          url: "https://reddit.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670226.png",
        },
        {
          name: "Discord",
          url: "https://discord.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670157.png",
        },
        {
          name: "Quora",
          url: "https://www.quora.com",
          icon: "https://cdn-icons-png.flaticon.com/128/4494/4494531.png",
        },
        {
          name: "Mastodon",
          url: "https://mastodon.social",
          icon: "https://cdn-icons-png.flaticon.com/128/9954/9954492.png",
        },
      ],
      Entertainment: [
        {
          name: "YouTube",
          url: "https://youtube.com",
          icon: "https://cdn-icons-png.flaticon.com/512/1384/1384060.png",
        },
        {
          name: "Netflix",
          url: "https://netflix.com",
          icon: "https://cdn-icons-png.flaticon.com/512/732/732228.png",
        },
        {
          name: "Prime Video",
          url: "https://primevideo.com",
          icon: "https://img.icons8.com/?size=520&id=Rs68BrhxH0XZ&format=png",
        },
        {
          name: "Spotify",
          url: "https://open.spotify.com",
          icon: "https://cdn-icons-png.flaticon.com/128/3670/3670176.png",
        },
      ],
      DataBase: [
        {
          name: "Firebase",
          url: "https://console.firebase.google.com/u/0/",
          icon: "https://images.seeklogo.com/logo-png/61/1/firebase-icon-logo-png_seeklogo-615938.png",
        },
        {
          name: "Cloudinary",
          url: "https://console.cloudinary.com/app/c-e71e8fe00683ff6a2fba091e038d10/home/dashboard",
          icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAk1BMVEX///80SMUjO8IyRsUqQMOJk9r5+f0aNsGts+Pg4/a3vuovRMQrQcOdpuL9/f9BVcrl6PjGy+0OL8BPYMyDjtqhqeJve9Px8vtjctLZ3PM7Tsa+xOuSnN9+itrAxuvt7/p2gtYAKL/O0/E4Tslcac1RYc1JWsupsOWzuunR1vJodtKepd9hcdIAH71HWMqWn94AD7z7DXZFAAAMDklEQVR4nO1daXeyPBAtSQQ1URH3Feuu9a3P//91Lyq2TDZA2XpO7peeoynkmstkMjMJHx8GBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGDwd/E/Bq3M20qAmfEAAAAASUVORK5CYII=",
        },
      ],
    };
    saveState();
  };

  const initializeApp = () => {
    // NOTE: This version is for the New Tab Page and Dedicated Window, 
    // so we don't need to check for existing hosts or backdrops.
    
    // Set body to full-screen immediately for a clean look
    document.body.style.cssText = "margin:0; padding:0; height:100vh; width:100vw; overflow:hidden;";

    if (!chrome || !chrome.storage || !chrome.storage.local) {
      console.error(
        "PrinceExt Error: chrome.storage.local is not available. Ensure this runs as an extension with 'storage' permission."
      );
      initializeDefaultState();
      buildUI();
      return;
    }

    chrome.storage.local.get(
      ["webhub_tabs_v1", "webhub_tabContent_v1"],
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(
            "PrinceExt Error: Failed to load state.",
            chrome.runtime.lastError
          );
          initializeDefaultState();
        } else if (result.webhub_tabs_v1 && result.webhub_tabContent_v1) {
          tabs = result.webhub_tabs_v1;
          tabContent = result.webhub_tabContent_v1;
          if (
            !Array.isArray(tabs) ||
            typeof tabContent !== "object" ||
            tabs.length === 0
          ) {
            console.error("PrinceExt Error: Corrupt data in storage. Resetting.");
            initializeDefaultState();
          }
        } else {
          initializeDefaultState();
        }
        buildUI();
      }
    );
  };

  const buildUI = () => {
    isDeleteMode = false;
    const host = document.createElement("div");
    host.id = "webhub-shadow-host";
    
    // Full-page styling for New Tab or Popup Window
    host.style.cssText =
      "position:absolute; top:0; left:0; width:100%; height:100%; display:flex; align-items:center; justify-content:center; opacity:1; transform:scale(1); transition:none; z-index:999999;";
    
    // Create Shadow DOM
    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    
    // --- START OF ADAPTED CSS ---
    // Removed backdrop styles and overlay positioning/transitions
    style.textContent = `
    
      :root {
        --bg-color-light: rgba(247, 248, 250, 1); /* Changed opacity from 0.95 to 1 for solid background */
        --bg-color-dark: rgba(25, 25, 25, 1);
        --text-color-light: #000;
        --text-color-dark: #eee;
        --card-bg-light: #f9f9f9;
        --card-bg-dark: #333;
        --header-bg-light: rgba(230, 232, 235, 1);
        --header-bg-dark: rgba(45, 45, 45, 1);
        --nav-bg-light: rgba(255, 255, 255, 1);
        --nav-bg-dark: rgba(50, 50, 50, 1);
        --border-color-light: rgba(0, 0, 0, 0.1);
        --border-color-dark: rgba(255, 255, 255, 0.1);
        /* Shadows removed for clean full-page look */
        --shadow-light: none;
        --shadow-dark: none;
      }
      
      .wrapper {
        background: var(--bg-color-light) !important;
        color: var(--text-color-light) !important;
        box-shadow: none !important; 
        border: none !important; 
      }
      
      .dark-mode .wrapper {
        background: var(--bg-color-dark) !important;
        color: var(--text-color-dark) !important;
        box-shadow: none !important;
        border: none !important;
      }
      
      .dark-mode .header {
        background: var(--header-bg-dark) !important;
        border-bottom: 1px solid var(--border-color-dark) !important;
      }

      .header {
        background: var(--header-bg-light) !important;
        padding: 14px 20px !important;
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        cursor: default !important; /* Removed grab cursor */
        user-select: none !important;
        border-bottom: 1px solid var(--border-color-light) !important;
      }
      
      .dark-mode .nav {
        background: var(--nav-bg-dark) !important;
        border-bottom: 1px solid var(--border-color-dark) !important;
      }
      
      .nav {
        display: flex !important;
        padding: 12px !important;
        background: var(--nav-bg-light) !important;
        align-items: center !important;
        border-bottom: 1px solid var(--border-color-light) !important;
      }
      
      .dark-mode .search-container {
        background: #222 !important;
        border-bottom: 1px solid var(--border-color-dark) !important;
      }
      
      .search-container {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px !important;
        background: #f0f2f5 !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
      }
      
      .dark-mode .search-input {
        background-color: #444 !important;
        color: #fff !important;
        border-color: #555 !important;
      }
      
      .search-input {
        flex-grow: 1;
        width: 100% !important;
        padding: 10px 15px !important;
        border-radius: 10px !important;
        border: 1px solid #ccc !important;
        font-size: 14px !important;
        outline: none !important;
        transition: all 0.2s ease !important;
        background-color: #fff !important;
        color: #333 !important;
      }
      
      .dark-mode .content {
        background: #222 !important;
      }
      
      .content {
        position: relative !important;
        flex: 1 !important;
        overflow-y: auto !important;
        padding: 20px !important;
        background: #fff !important;
      }
      
      .dark-mode .card {
        background: var(--card-bg-dark) !important;
        border: 1px solid var(--border-color-dark) !important;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1) !important;
      }
      
      .dark-mode .card:hover {
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2) !important;
        border-color: #444 !important;
      }
      
      .card {
        position: relative !important;
        background: var(--card-bg-light) !important;
        border: 1px solid var(--border-color-light) !important;
        border-radius: 12px !important;
        padding: 16px 8px !important;
        text-align: center !important;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03) !important;
        transition: all 0.3s ease !important;
        cursor: pointer !important;
        height: 120px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        animation: fadeIn 0.4s ease forwards;
        opacity: 0;
      }
      
      .dark-mode .modal {
        background: #333 !important;
        border: 1px solid #444 !important;
        color: #eee !important;
      }

      .dark-mode .modal-input, .dark-mode .modal-select {
        background: #444 !important;
        color: #fff !important;
        border: 1px solid #555 !important;
      }

      .dark-mode .modal-button.primary {
        background: #555 !important;
        color: #fff !important;
      }
      
      .dark-mode .modal-button.primary:hover {
        background: #666 !important;
      }

      .dark-mode .modal-button.secondary {
        background: #444 !important;
        color: #eee !important;
      }
      
      .dark-mode .modal-button.secondary:hover {
        background: #555 !important;
      }

      .dark-mode .action-btn {
        background: #444 !important;
        border: 1px solid #555 !important;
      }
      
      .dark-mode .action-btn svg {
        fill: #eee !important;
      }

      .dark-mode .delete-mode-btn.active {
        background: #b71c1c !important;
        border-color: #ef5350 !important;
      }
      
      .dark-mode .delete-mode-btn.active svg {
        fill: #fff !important;
      }
      
      .dark-mode .card-menu-btn {
        background: rgba(255, 255, 255, 0.1) !important;
      }
      
      .dark-mode .card-menu-btn svg {
        fill: #eee !important;
      }
      
      .dark-mode .add-card {
        border-color: #555 !important;
        background: #444 !important;
      }
      
      .dark-mode .add-card:hover {
        background: #555 !important;
        border-color: #666 !important;
      }

      .dark-mode .add-card svg {
        fill: #999 !important;
      }
      
      * {
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 !important;
        font-family: 'Inter', 'Segoe UI', Roboto, -apple-system, sans-serif !important;
      }
      
      .card img {
        width: 40px !important;
        height: 40px !important;
        margin-bottom: 10px !important;
        object-fit: contain !important;
      }
      
      .modal-input, .modal-select {
        width: 100% !important;
        padding: 12px !important;
        border: 1px solid #ccc !important;
        border-radius: 10px !important;
        font-size: 14px !important;
        background: #fff !important;
        color: #333 !important;
      }
      
      .modal-input:focus, .modal-select:focus {
        outline: none !important;
        border-color: #888 !important;
        box-shadow: 0 0 0 3px rgba(100, 100, 100, 0.15) !important;
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes modal-scale-in {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
      
      .wrapper {
        width: 100vw; /* Full width */
        height: 100vh; /* Full height */
        max-width: none;
        min-height: 100%;
        border-radius: 0 !important; /* No rounded corners */
        backdrop-filter: blur(15px) !important;
        display: flex !important;
        flex-direction: column !important;
        overflow: hidden !important;
      }
      
      .header-logo {
        width: 24px !important;
        height: 24px !important;
      }
      
      .header-title {
        font-weight: 600 !important;
        font-size: 16px !important;
        color: #333 !important;
      }
      
      .dark-mode .header-title {
        color: #eee !important;
      }
      
      .close {
        background: rgba(0, 0, 0, 0.08) !important;
        border: none !important;
        font-size: 24px !important;
        cursor: pointer !important;
        color: #333 !important;
        width: 28px !important;
        height: 28px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 50% !important;
        transition: all 0.2s ease !important;
        line-height: 1 !important;
        padding-bottom: 2px !important;
      }
      
      .dark-mode .close {
        background: rgba(255, 255, 255, 0.08) !important;
        color: #eee !important;
      }
      
      .close svg {
        width: 16px !important;
        height: 16px !important;
        fill: #333 !important;
      }
      
      .dark-mode .close svg {
        fill: #eee !important;
      }
      
      .close:hover {
        background: rgba(0, 0, 0, 0.15) !important;
        transform: rotate(90deg) !important;
      }
      
      .dark-mode .close:hover {
        background: rgba(255, 255, 255, 0.15) !important;
      }
      
      .nav-tabs {
        display: flex !important;
        gap: 8px !important;
        flex-grow: 1 !important;
        overflow-x: auto !important;
        flex-wrap: nowrap !important;
        padding-bottom: 10px !important;
        margin-bottom: -10px !important;
      }
      
      .nav-tabs::-webkit-scrollbar {
        height: 6px !important;
      }
      
      .nav-tabs::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05) !important;
      }
      
      .nav-tabs::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.2) !important;
        border-radius: 3px !important;
      }
      
      .nav button {
        line-height: 1.5 !important;
        padding: 8px 16px !important;
        font-size: 13px !important;
        font-weight: 600 !important;
        border: 1px solid #dcdcdc !important;
        border-radius: 10px !important;
        cursor: pointer !important;
        background: #fff !important;
        color: #555 !important;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
        transition: all 0.2s ease !important;
        flex-shrink: 0 !important;
      }
      
      .dark-mode .nav button {
        background: #444 !important;
        color: #eee !important;
        border-color: #555 !important;
      }
      
      .nav button.active {
        background: #e0e0e0 !important;
        color: #333 !important;
        border-color: #c0c0c0 !important;
      }
      
      .dark-mode .nav button.active {
        background: #666 !important;
        color: #eee !important;
        border-color: #777 !important;
      }
      
      .nav.delete-mode .nav-tabs button {
        background: #ffebee !important;
        color: #b71c1c !important;
        border-color: #ef9a9a !important;
        cursor: crosshair !important;
      }
      
      .dark-mode .nav.delete-mode .nav-tabs button {
        background: #b71c1c !important;
        color: #fff !important;
        border-color: #ef5350 !important;
      }
      
      .search-input::placeholder {
        color: #999 !important;
        opacity: 1 !important;
      }
      
      .dark-mode .search-input::placeholder {
        color: #bbb !important;
      }
      
      .action-btn {
        background: #f0f0f0 !important;
        border: 1px solid #dcdcdc !important;
        padding: 8px !important;
        width: 36px !important;
        height: 38px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 10px !important;
        flex-shrink: 0;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      
      .action-btn svg {
        width: 18px !important;
        height: 18px !important;
        fill: #333 !important;
        transition: all 0.2s ease;
      }
      
      .action-btn:hover {
        background: #e0e0e0 !important;
      }
      
      .delete-mode-btn.active {
        background: #f8b3b0 !important;
        border-color: #e57373 !important;
      }
      
      .delete-mode-btn.active svg {
        fill: #c0392b !important;
        transform: scale(1.1);
      }
      
      .card:hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.07) !important;
        border-color: #ddd !important;
      }
      
      .card p {
        line-height: 1.5 !important;
        font-size: 13px !important;
        color: #333 !important;
        font-weight: 500 !important;
      }
      
      .dark-mode .card p {
        color: #eee !important;
      }
      
      .content.grid-view {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
        gap: 16px !important;
      }
      
      .category-header {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #555 !important;
        padding-bottom: 5px !important;
        margin-top: 10px !important;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1) !important;
      }
      
      .dark-mode .category-header {
        color: #bbb !important;
        border-bottom-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .category-header:first-of-type {
        margin-top: 0 !important;
      }
      
      .category-grid {
        display: grid !important;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)) !important;
        gap: 16px !important;
        padding-top: 16px !important;
      }
      
      .footer {
        padding: 12px !important;
        text-align: center !important;
        font-size: 12px !important;
        color: #888 !important;
        background: #f0f2f5 !important;
        border-top: 1px solid rgba(0, 0, 0, 0.1) !important;
      }
      
      .dark-mode .footer {
        background: #222 !important;
        color: #888 !important;
        border-top-color: rgba(255, 255, 255, 0.1) !important;
      }
      
      .empty-state {
        padding: 40px !important;
        text-align: center !important;
        color: #666 !important;
        grid-column: 1 / -1;
      }
      
      .dark-mode .empty-state {
        color: #aaa !important;
      }
      
      .empty-state p {
        font-size: 15px !important;
        line-height: 1.5 !important;
      }
      
      .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: modal-scale-in 0.3s ease forwards;
        opacity: 0;
      }
      
      .modal {
        background: #fdfdfd !important;
        padding: 24px !important;
        border-radius: 12px !important;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15) !important;
        border: 1px solid #eee !important;
        width: 90% !important;
        max-width: 420px !important;
        text-align: left !important;
        transform: scale(0.95);
        animation: modal-scale-in 0.3s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
      }
      
      .modal-title {
        font-size: 20px !important;
        font-weight: 600 !important;
        margin-bottom: 8px !important;
        color: #333 !important;
        line-height: 1.5 !important;
      }
      
      .modal-message {
        font-size: 15px !important;
        color: #666 !important;
        margin-bottom: 20px !important;
        line-height: 1.5 !important;
      }
      
      .modal-footer {
        display: flex !important;
        justify-content: flex-end !important;
        gap: 10px !important;
        margin-top: 24px !important;
      }
      
      .modal-button {
        padding: 10px 20px !important;
        border-radius: 8px !important;
        border: none !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.2s ease;
        line-height: 1.5 !important;
      }
      
      .modal-button.primary {
        background: #2c3e50 !important;
        color: #fff !important;
      }
      
      .modal-button.primary:hover {
        background: #34495e !important;
      }
      
      .modal-button.secondary {
        background: #ecf0f1 !important;
        color: #34495e !important;
      }
      
      .modal-button.secondary:hover {
        background: #e0e6e8 !important;
      }
      
      .card-menu-btn {
        position: absolute !important;
        top: 6px !important;
        right: 6px !important;
        background: rgba(0, 0, 0, 0.08) !important;
        border: none !important;
        border-radius: 50% !important;
        width: 26px !important;
        height: 26px !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        opacity: 0 !important;
        transition: opacity 0.2s ease, background 0.2s ease !important;
        z-index: 5 !important;
      }
      
      .card:hover .card-menu-btn {
        opacity: 1 !important;
      }
      
      .card-menu-btn:hover {
        background: rgba(0, 0, 0, 0.15) !important;
      }
      
      .card-menu-btn svg {
        width: 16px !important;
        height: 16px !important;
        fill: #333 !important;
      }
      
      .modal-form-group {
        margin-bottom: 16px !important;
      }
      
      .modal-form-group label {
        display: block !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: #555 !important;
        margin-bottom: 6px !important;
      }
      
      .modal-footer {
        justify-content: space-between !important;
        align-items: center !important;
      }
      
      .modal-button.danger {
        background: #f1f1f1 !important;
        color: #c0392b !important;
        margin-right: auto;
      }
      
      .modal-button.danger:hover {
        background: #e74c3c !important;
        color: #fff !important;
      }
      
      .action-btn {
        position: relative !important;
      }
      
      .action-btn::before {
        content: attr(data-tooltip) !important;
        position: absolute !important;
        bottom: 125% !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-color: #2c3e50 !important;
        color: #fff !important;
        padding: 6px 10px !important;
        border-radius: 6px !important;
        font-size: 12px !important;
        font-weight: 500 !important;
        white-space: nowrap !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.2s ease, visibility 0.2s ease !important;
        pointer-events: none !important;
        z-index: 10 !important;
      }
      
      .action-btn::after {
        content: '' !important;
        position: absolute !important;
        bottom: 125% !important;
        left: 50% !important;
        transform: translate(-50%, 10px) !important;
        border: 6px solid transparent !important;
        border-top-color: #2c3e50 !important;
        opacity: 0 !important;
        visibility: hidden !important;
        transition: opacity 0.2s ease, visibility 0.2s ease !important;
        pointer-events: none !important;
        z-index: 10 !important;
      }
      
      .action-btn:hover::before, .action-btn:hover::after {
        opacity: 1 !important;
        visibility: visible !important;
      }
      
      .add-card {
        border: 2px dashed #b0bec5 !important;
        background: #eceff1 !important;
        cursor: pointer !important;
        transition: all 0.2s ease !important;
      }
      
      .add-card:hover {
        background: #cfd8dc !important;
        border-color: #90a4ae !important;
        transform: translateY(-5px) !important;
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.07) !important;
      }
      
      .add-card svg {
        width: 48px !important;
        height: 48px !important;
        fill: #546e7a !important;
        transition: transform 0.2s ease !important;
      }
      
      .add-card:hover svg {
        transform: scale(1.1) !important;
      }
      
      .resizer {
        display: none !important; /* Removed resizer logic */
      }
    `;
    // --- END OF ADAPTED CSS ---

    shadow.appendChild(style);
    
    const ICONS = {
      add: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`,
      delete: `<svg viewBox="0 0 24 24"><path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12z"/></svg>`,
      reset: `<svg viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>`,
      more: `<svg viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>`,
    };
    const showModal = (config) => {
      const {
        type,
        title,
        message,
        placeholder = "",
        primaryActionText = "Confirm",
        onConfirm,
        onCancel,
      } = config;
      const existingModal = shadow.querySelector(".modal-backdrop");
      if (existingModal) existingModal.remove();
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `<p class="modal-title">${title}</p><p class="modal-message">${message}</p>${
        type === "prompt"
          ? `<input type="text" class="modal-input" placeholder="${placeholder}">`
          : ""
      }<div class="modal-footer"></div>`;
      const footer = modal.querySelector(".modal-footer");
      const closeModal = () => modalBackdrop.remove();
      if (type === "prompt" || type === "confirm") {
        const confirmBtn = document.createElement("button");
        confirmBtn.textContent = primaryActionText;
        confirmBtn.className = "modal-button primary";
        confirmBtn.onclick = () => {
          if (onConfirm) {
            const val =
              type === "prompt"
                ? modal.querySelector(".modal-input").value
                : true;
            onConfirm(val);
          }
          closeModal();
        };
        footer.appendChild(confirmBtn);
        if (type === "prompt") {
          const inputField = modal.querySelector(".modal-input");
          setTimeout(() => inputField.focus(), 50);
          inputField.onkeydown = (e) => {
            if (e.key === "Enter") confirmBtn.click();
          };
        }
      }
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = type === "alert" ? "OK" : "Cancel";
      cancelBtn.className = "modal-button secondary";
      cancelBtn.onclick = () => {
        if (onCancel) onCancel();
        if (onConfirm && type === "confirm") onConfirm(false);
        closeModal();
      };
      footer.appendChild(cancelBtn);
      modalBackdrop.onclick = (e) => {
        if (e.target === modalBackdrop) cancelBtn.click();
      };
      modalBackdrop.appendChild(modal);
      shadow.appendChild(modalBackdrop);
    };
    const showAddAppModal = (categoryName) => {
      const existingModal = shadow.querySelector(".modal-backdrop");
      if (existingModal) existingModal.remove();
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `<p class="modal-title">Add App to "${categoryName}"</p><div class="modal-form-group"><label for="add-name-input">App Name</label><input type="text" id="add-name-input" class="modal-input" placeholder="e.g., Google"></div><div class="modal-form-group"><label for="add-url-input">App URL</label><input type="url" id="add-url-input" class="modal-input" placeholder="https://google.com"></div><div class="modal-form-group"><label for="add-icon-input">Icon URL (Optional)</label><input type="url" id="add-icon-input" class="modal-input" placeholder="Paste image address here"></div><div class="modal-footer"></div>`;
      const nameInput = modal.querySelector("#add-name-input");
      const urlInput = modal.querySelector("#add-url-input");
      const footer = modal.querySelector(".modal-footer");
      const closeModal = () => modalBackdrop.remove();
      const rightSideButtons = document.createElement("div");
      rightSideButtons.style.cssText =
        "display: flex; gap: 10px; margin-left: auto;";
      const addBtn = document.createElement("button");
      addBtn.textContent = "Add App";
      addBtn.className = "modal-button primary";
      addBtn.onclick = () => {
        const name = nameInput.value.trim();
        let url = urlInput.value.trim();
        const iconUrl = modal.querySelector("#add-icon-input").value.trim();

        if (!name || !url) {
          showModal({
            type: "alert",
            title: "Error",
            message: "Please fill out all fields.",
          });
          return;
        }
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        const icon = iconUrl ? iconUrl : `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`;
        const newApp = { name, url, icon };
        tabContent[categoryName].push(newApp);
        saveState();
        setActiveTab(categoryName);
        closeModal();
      };
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "modal-button secondary";
      cancelBtn.onclick = closeModal;
      rightSideButtons.appendChild(cancelBtn);
      rightSideButtons.appendChild(addBtn);
      footer.appendChild(rightSideButtons);
      modalBackdrop.appendChild(modal);
      shadow.appendChild(modalBackdrop);
      setTimeout(() => nameInput.focus(), 50);
    };
    const showEditAppModal = (item, categoryName) => {
      const existingModal = shadow.querySelector(".modal-backdrop");
      if (existingModal) existingModal.remove();
      const modalBackdrop = document.createElement("div");
      modalBackdrop.className = "modal-backdrop";
      const modal = document.createElement("div");
      modal.className = "modal";
      const currentIconValue = item.icon.startsWith('https://www.google.com/s2/favicons') ? '' : item.icon;
      modal.innerHTML = `<p class="modal-title">Edit App</p><div class="modal-form-group"><label for="edit-name-input">Name</label><input type="text" id="edit-name-input" class="modal-input" value="${item.name}"></div><div class="modal-form-group"><label for="edit-url-input">URL</label><input type="text" id="edit-url-input" class="modal-input" value="${item.url}"></div><div class="modal-form-group"><label for="edit-icon-input">Icon URL (Optional)</label><input type="text" id="edit-icon-input" class="modal-input" value="${currentIconValue}" placeholder="Paste image address to override favicon"></div><div class="modal-footer"></div>`;
      const nameInput = modal.querySelector("#edit-name-input");
      const urlInput = modal.querySelector("#edit-url-input");
      const footer = modal.querySelector(".modal-footer");
      const closeModal = () => modalBackdrop.remove();
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete App";
      deleteBtn.className = "modal-button danger";
      deleteBtn.onclick = () => {
        showModal({
          type: "confirm",
          title: "Delete App?",
          message: `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
          primaryActionText: "Yes, Delete",
          onConfirm: (confirmed) => {
            if (confirmed) {
              const categoryItems = tabContent[categoryName];
              const itemIndex = categoryItems.findIndex(
                (i) => i.name === item.name && i.url === item.url
              );
              if (itemIndex > -1) {
                categoryItems.splice(itemIndex, 1);
                saveState();
                searchInput.value
                  ? renderSearchResults(searchInput.value)
                  : renderContent();
              }
              closeModal();
            }
          },
        });
      };
      const actionButtons = document.createElement("div");
      actionButtons.style.cssText = "display: flex; gap: 10px;";
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.className = "modal-button primary";
      saveBtn.onclick = () => {
        const newName = nameInput.value.trim();
        const newUrl = urlInput.value.trim();
        if (!newName || !newUrl) return;
        const categoryItems = tabContent[categoryName];
        const itemToUpdate = categoryItems.find(
          (i) => i.name === item.name && i.url === item.url
        );
        if (itemToUpdate) {
          itemToUpdate.name = newName;
          itemToUpdate.url = newUrl;
          saveState();
          searchInput.value
            ? renderSearchResults(searchInput.value)
            : renderContent();
        }
        closeModal();
      };
      const cancelBtn = document.createElement("button");
      cancelBtn.textContent = "Cancel";
      cancelBtn.className = "modal-button secondary";
      cancelBtn.onclick = closeModal;
      footer.appendChild(deleteBtn);
      actionButtons.appendChild(cancelBtn);
      actionButtons.appendChild(saveBtn);
      footer.appendChild(actionButtons);
      modalBackdrop.appendChild(modal);
      shadow.appendChild(modalBackdrop);
      setTimeout(() => nameInput.focus(), 50);
    };
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    const header = document.createElement("div");
    header.className = "header";
    const titleContainer = document.createElement("div");
    titleContainer.style.cssText =
      "display:flex; align-items:center; gap:10px;";
    titleContainer.innerHTML = `<img src="https://img.icons8.com/?size=200&id=nDNCmmDBtU8l&format=png" class="header-logo"><span class="header-title">PrinceExt
    </span>`;
    const headerActions = document.createElement("div");
    headerActions.style.cssText =
      "display: flex; align-items: center; gap: 8px;";
    const resetBtn = document.createElement("button");
    resetBtn.className = "close";
    resetBtn.innerHTML = ICONS.reset;
    resetBtn.title = "Reset Extension";
    resetBtn.onclick = () => {
      showModal({
        type: "confirm",
        title: "Reset Extension?",
        message:
          "Are you sure? All your custom categories and links will be permanently deleted.",
        primaryActionText: "Yes, Reset",
        onConfirm: (confirmed) => {
          if (confirmed) {
            if (chrome && chrome.storage && chrome.storage.local) {
              chrome.storage.local.clear(() => {
                initializeDefaultState();
                searchInput.value = "";
                navTabsContainer.innerHTML = "";
                tabs.forEach((tab) =>
                  navTabsContainer.appendChild(createTabButton(tab))
                );
                setActiveTab(tabs.length > 0 ? tabs[0] : null);
                showModal({
                  type: "alert",
                  title: "Reset Complete",
                  message: "The extension has been successfully reset.",
                });
              });
            }
          }
        },
      });
    };
    const closeBtn = document.createElement("button");
    closeBtn.className = "close";
    closeBtn.innerHTML = "×";
    // Check if the current environment is the dedicated popup window
    if (window.location.href.includes('hub_window.html')) {
        closeBtn.onclick = () => window.close(); // Close the popup window
    } else {
        // For New Tab Page, the button acts as an aesthetic close/reset button or could be repurposed
        closeBtn.onclick = () => {
            // New Tab behavior: could be a no-op or close the current tab (optional)
        };
    }

    headerActions.appendChild(resetBtn);
    
    // Only show close button in the dedicated window as the New Tab Page has its own close/tab system
    if (window.location.href.includes('hub_window.html')) {
        headerActions.appendChild(closeBtn); 
    }
    
    header.appendChild(titleContainer);
    header.appendChild(headerActions);
    wrapper.appendChild(header);
    const searchContainer = document.createElement("div");
    searchContainer.className = "search-container";
    const searchInput = document.createElement("input");
    searchInput.className = "search-input";
    searchInput.placeholder = "Search all apps...";
    searchContainer.appendChild(searchInput);
    const addCategoryBtn = document.createElement("button");
    addCategoryBtn.innerHTML = ICONS.add;
    addCategoryBtn.setAttribute("data-tooltip", "Add new category");
    addCategoryBtn.className = "action-btn";
    const deleteModeBtn = document.createElement("button");
    deleteModeBtn.innerHTML = ICONS.delete;
    deleteModeBtn.setAttribute("data-tooltip", "Delete category");
    deleteModeBtn.className = "action-btn delete-mode-btn";
    searchContainer.appendChild(addCategoryBtn);
    searchContainer.appendChild(deleteModeBtn);
    wrapper.appendChild(searchContainer);
    const nav = document.createElement("div");
    nav.className = "nav";
    const navTabsContainer = document.createElement("div");
    navTabsContainer.className = "nav-tabs";
    nav.appendChild(navTabsContainer);
    let currentTab = null;
    const content = document.createElement("div");

    const createCard = (item, categoryName, index = 0) => {
      const card = document.createElement("div");
      card.className = "card";
      card.style.animationDelay = `${index * 0.04}s`;
      card.onclick = () => window.open(item.url, "_blank");
      const img = document.createElement("img");
      img.alt = item.name;
      img.loading = "lazy";
      img.src = FALLBACK_ICON_SVG;
      const p = document.createElement("p");
      p.textContent = item.name;
      const menuBtn = document.createElement("button");
      menuBtn.className = "card-menu-btn";
      menuBtn.innerHTML = ICONS.more;
      menuBtn.title = "Edit app";
      menuBtn.onclick = (e) => {
        e.stopPropagation();
        showEditAppModal(item, categoryName);
      };
      card.appendChild(img);
      card.appendChild(p);
      card.appendChild(menuBtn);
      chrome.runtime.sendMessage(
        { type: "fetchImageAsBase64", url: item.icon },
        (response) => {
          if (response && response.success) {
            img.src = response.dataUrl;
          }
        }
      );
      return card;
    };

    const renderContent = (filter = "") => {
      content.innerHTML = "";
      content.className = "content";
      const isSearching = filter !== "";
      if (!currentTab) {
        content.innerHTML = `<div class="empty-state"><p>No categories available. Add one!</p></div>`;
        return;
      }
      const items = tabContent[currentTab] || [];
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
      if (isSearching && filteredItems.length === 0) {
        content.innerHTML = `<div class="empty-state"><p>No results found for "${filter}"</p></div>`;
        return;
      }
      content.classList.add("grid-view");
      filteredItems.forEach((item, index) => {
        content.appendChild(createCard(item, currentTab, index));
      });
      if (!isSearching) {
        if (filteredItems.length === 0) {
          const emptyState = document.createElement("div");
          emptyState.className = "empty-state";
          emptyState.innerHTML = `<p>This category is empty. Click the '+' card to add an app!</p>`;
          content.appendChild(emptyState);
        }
        const addCard = document.createElement("div");
        addCard.className = "card add-card";
        addCard.innerHTML = `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`;
        addCard.title = `Add new app to ${currentTab}`;
        addCard.onclick = () => showAddAppModal(currentTab);
        content.appendChild(addCard);
      }
    };
    const renderSearchResults = (query) => {
      content.innerHTML = "";
      content.className = "content";
      let totalResults = 0;
      Object.entries(tabContent).forEach(([category, items]) => {
        const filteredItems = items.filter((item) =>
          item.name.toLowerCase().includes(query.toLowerCase())
        );
        if (filteredItems.length > 0) {
          totalResults++;
          const headerEl = document.createElement("h3");
          headerEl.className = "category-header";
          headerEl.textContent = category;
          content.appendChild(headerEl);
          const grid = document.createElement("div");
          grid.className = "category-grid";
          filteredItems.forEach((item, index) =>
            grid.appendChild(createCard(item, category, index))
          );
          content.appendChild(grid);
        }
      });
      if (totalResults === 0) {
        content.innerHTML = `<div class="empty-state"><p>No results found for "${query}"</p></div>`;
      }
    };
    const setActiveTab = (tabName) => {
      if (isDeleteMode) return;
      if (!tabName) {
        currentTab = null;
        navTabsContainer
          .querySelectorAll("button")
          .forEach((btn) => btn.classList.remove("active"));
        renderContent();
        return;
      }
      currentTab = tabName;
      navTabsContainer.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("active", btn.textContent === tabName);
      });
      renderContent();
    };
    const createTabButton = (tabName) => {
      const button = document.createElement("button");
      button.textContent = tabName;
      button.onclick = () => {
        if (isDeleteMode) {
          showModal({
            type: "confirm",
            title: "Delete Category",
            message: `Are you sure you want to delete "${tabName}"? All links inside will be lost.`,
            primaryActionText: "Yes, Delete",
            onConfirm: (confirmed) => {
              if (confirmed) {
                delete tabContent[tabName];
                tabs.splice(tabs.indexOf(tabName), 1);
                saveState();
                button.remove();
                isDeleteMode = false;
                nav.classList.remove("delete-mode");
                deleteModeBtn.classList.remove("active");
                if (currentTab === tabName) {
                  setActiveTab(tabs.length > 0 ? tabs[0] : null);
                }
              }
            },
          });
        } else {
          if (currentTab === tabName && searchInput.value === "") return;
          searchInput.value = "";
          setActiveTab(tabName);
        }
      };
      return button;
    };
    tabs.forEach((tab) => navTabsContainer.appendChild(createTabButton(tab)));
    addCategoryBtn.onclick = () => {
      if (isDeleteMode) return;
      showModal({
        type: "prompt",
        title: "Add New Category",
        message: "Enter a name for the new category.",
        placeholder: "e.g., Study Material",
        primaryActionText: "Add",
        onConfirm: (newCategoryName) => {
          if (newCategoryName && newCategoryName.trim() !== "") {
            const trimmedName = newCategoryName.trim();
            if (tabContent.hasOwnProperty(trimmedName)) {
              showModal({
                type: "alert",
                title: "Error",
                message: "A category with this name already exists.",
              });
              return;
            }
            tabContent[trimmedName] = [];
            tabs.push(trimmedName);
            saveState();
            const newButton = createTabButton(trimmedName);
            navTabsContainer.appendChild(newButton);
            setActiveTab(trimmedName);
            newButton.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
              inline: "end",
            });
          }
        },
      });
    };
    deleteModeBtn.onclick = () => {
      isDeleteMode = !isDeleteMode;
      nav.classList.toggle("delete-mode", isDeleteMode);
      deleteModeBtn.classList.toggle("active", isDeleteMode);
    };
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim().toLowerCase();
      if (query) {
        navTabsContainer
          .querySelectorAll("button")
          .forEach((btn) => btn.classList.remove("active"));
        renderSearchResults(query);
      } else {
        setActiveTab(currentTab);
      }
    });
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const firstResult = shadow.querySelector(
          ".content .card:not(.add-card)"
        );
        if (firstResult) firstResult.click();
      }
    });
    wrapper.appendChild(nav);
    wrapper.appendChild(content);
    const footer = document.createElement("div");
    footer.className = "footer";
    footer.textContent = "Powered by — Prince Yadav ☕";
    wrapper.appendChild(footer);
    shadow.appendChild(wrapper);
    document.body.appendChild(host);
    
    // No drag, resize, or explicit positioning/transition logic needed for full-page modes
    
    setActiveTab(tabs.length > 0 ? tabs[0] : null);
    
    // Auto-focus search on load
    setTimeout(() => {
      searchInput.focus();
    }, 100);
  };

  // Start the application
  initializeApp();
})();