// Authentication Helper Functions

function checkAuth(requiredRole) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!token || !user) {
    window.location.href = '/login';
    return false;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    alert('Unauthorized access');
    window.location.href = '/';
    return false;
  }
  
  return true;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
}

// API Helper Function
async function apiCall(endpoint, method = 'GET', body = null) {
  const token = localStorage.getItem('token');
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API call failed');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Sidebar Active Link
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  
  sidebarLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// Form Validation Helper
function validateForm(formId) {
  const form = document.getElementById(formId);
  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'red';
      isValid = false;
    } else {
      input.style.borderColor = '#000';
    }
  });
  
  return isValid;
}

// Date Formatter
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Notification System (Simple Alert)
function showNotification(message, type = 'info') {
  alert(message);
}

// Export functions for use in other scripts
window.checkAuth = checkAuth;
window.logout = logout;
window.apiCall = apiCall;
window.validateForm = validateForm;
window.formatDate = formatDate;
window.showNotification = showNotification;
