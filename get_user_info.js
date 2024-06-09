async function getUserInfo() {
  try {
    // Fetch IP Address
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip;

    // Get device information from user agent
    const userAgent = navigator.userAgent;

    // Basic parsing (you can use a library for more detailed parsing)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const browser = (userAgent.indexOf("Opera") || userAgent.indexOf('OPR')) != -1 ? 'Opera' :
                    (userAgent.indexOf("Chrome") != -1 ? 'Chrome' :
                    (userAgent.indexOf("Safari") != -1 ? 'Safari' :
                    (userAgent.indexOf("Firefox") != -1 ? 'Firefox' :
                    (userAgent.indexOf("MSIE") != -1 || userAgent.indexOf('Trident/') != -1) ? 'IE' :
                    'Unknown')));

    // Get screen size (you'll need media queries in your CSS)
    const screenWidth = window.innerWidth;
    let deviceType = "Unknown";
    if (screenWidth <= 768) deviceType = "Phone";
    else if (screenWidth <= 1024) deviceType = "Tablet";
    else deviceType = "Desktop";

    // Get referrer and timestamp
    const referrer = document.referrer || "Direct";
    const timestamp = new Date().toISOString();

    return { ipAddress, userAgent, isMobile, browser, deviceType, referrer, timestamp };
  } catch (error) {
    console.error("Error fetching user info:", error);
    return { 
      ipAddress: null, 
      userAgent: null, 
      isMobile: null, 
      browser: null, 
      deviceType: null, 
      referrer: null,
      timestamp: null
    };
  }
}

async function sendToWebhook(userInfo, webhookUrl) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: `New user information:\nIP Address: ${userInfo.ipAddress || "Not available"}\nUser Agent: ${userInfo.userAgent || "Not available"}\nDevice Type: ${userInfo.deviceType || "Not available"}\nBrowser: ${userInfo.browser || "Not available"}\nReferrer: ${userInfo.referrer || "Not available"}\nTimestamp: ${userInfo.timestamp || "Not available"}` 
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Error sending to webhook:", error);
  }
}
