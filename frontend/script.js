document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorText = document.getElementById('error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Save token in localStorage
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        window.location.href = 'dashboard.html';
      } else {
        errorText.textContent = data.message || 'Login failed';
      }
    } catch (err) {
      console.error(err);
      errorText.textContent = 'Something went wrong. Try again!';
    }
  });
});
