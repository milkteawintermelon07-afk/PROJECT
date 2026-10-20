'use strict';

const menuToggle = document.getElementById('menuToggle');
const navigation = document.getElementById('navigation');
if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));
}

const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    themeToggle.textContent = document.body.classList.contains('dark-theme') ? '♡ Change to Light' : '♡ Change Colors';
  });
}

const welcomeBtn = document.getElementById('welcomeBtn');
if (welcomeBtn) welcomeBtn.addEventListener('click', () => alert('Hello, lovely! ♡ Thanks for visiting my little corner!'));

const readMoreBtn = document.getElementById('readMoreBtn');
const extraAbout = document.getElementById('extraAbout');
if (readMoreBtn && extraAbout) {
  readMoreBtn.addEventListener('click', () => {
    const willShow = extraAbout.hidden;
    extraAbout.hidden = !willShow;
    readMoreBtn.setAttribute('aria-expanded', String(willShow));
    readMoreBtn.textContent = willShow ? 'A Little Less About Me −' : 'A Little More About Me +';
  });
}

const year = document.getElementById('currentYear');
if (year) year.textContent = new Date().getFullYear();

// Static websites cannot append directly to a Notepad file on the visitor's computer.
// This demo saves submissions in this browser, then lets the site owner export a .txt database.
const STORAGE_KEY = 'carlaContactMessages_v1';
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const exportButton = document.getElementById('exportMessagesBtn');

function getMessages() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    const message = {
      date: new Date().toLocaleString(),
      name: document.getElementById('visitorName').value.trim(),
      email: document.getElementById('visitorEmail').value.trim(),
      message: document.getElementById('visitorMessage').value.trim()
    };
    if (!message.name || !message.email || !message.message) {
      formNote.textContent = 'Please complete all fields before sending.';
      return;
    }
    try {
      const messages = getMessages();
      messages.push(message);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      formNote.textContent = 'Message saved in this browser! Click “Download Message Database” to save a Notepad text file.';
      contactForm.reset();
    } catch (error) {
      formNote.textContent = 'Could not save the message in this browser. Please check browser storage settings.';
    }
  });
}

if (exportButton) {
  exportButton.addEventListener('click', () => {
    const messages = getMessages();
    if (!messages.length) {
      if (formNote) formNote.textContent = 'There are no saved messages to export yet.';
      return;
    }
    const lines = [
      'CARLA MAE M. ELLIOT — CONTACT MESSAGE DATABASE',
      `Exported: ${new Date().toLocaleString()}`,
      `Total messages: ${messages.length}`,
      '='.repeat(55),
      ''
    ];
    messages.forEach((item, index) => {
      lines.push(`MESSAGE #${index + 1}`);
      lines.push(`Date: ${item.date}`);
      lines.push(`Name: ${item.name}`);
      lines.push(`Email: ${item.email}`);
      lines.push('Message:');
      lines.push(item.message);
      lines.push('-'.repeat(55), '');
    });
    const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = 'contact-message-database.txt';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    URL.revokeObjectURL(url);
    if (formNote) formNote.textContent = 'Your text database has been downloaded. Open it with Notepad.';
  });
}
