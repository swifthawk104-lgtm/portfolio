fetch("./data/index.json")
  .then(response => response.json())
  .then(data => {
    document.getElementById("message").textContent = data.message;

    const container = document.getElementById("page-links");

    data.page.forEach(item => {
      const a = document.createElement("a");
      a.href = item.link;
      a.textContent = item.name;
      a.style.setProperty("--btn-color", item.color);
      a.style.setProperty("--btn-hover-color", item.hoverColor);

      container.appendChild(a);
    });

  })
  .catch(error => {
    console.error("index.json の読み込みに失敗しました", error);
  });
