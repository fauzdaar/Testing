(function () {
  const usernameElement = document.getElementById("username");

  try {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready(); // Notify Telegram that the app is ready
      const user = tg.initDataUnsafe?.user; // Access user data

      if (user) {
        const username = user.username || user.first_name || "Guest";
        usernameElement.textContent = `Hello, ${username}! 👋`;
      } else {
        usernameElement.textContent = "Hello, Guest! 👋";
      }
    } else {
      throw new Error("Telegram WebApp is not available. Please open this app via Telegram.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    usernameElement.textContent = error.message;
    usernameElement.classList.add("error");
  }
})();
