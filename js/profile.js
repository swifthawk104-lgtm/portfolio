fetch("../data/profile.json")
  .then(response => response.json())
  .then(data => {
    document.getElementById("note").textContent = data.note;

    const list = document.getElementById("profile-list");

    data.profiles.forEach(item => {
      const div = document.createElement("div");
      div.className = "profile-item";

      div.innerHTML = `
        <div class="label">${item.label}</div>
        <div class="value">${item.value}</div>
      `;

      list.appendChild(div);
    });

  })
  .catch(error => {
    console.error("profile.js の読み込みに失敗しました", error);
  });
