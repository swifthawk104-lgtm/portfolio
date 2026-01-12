fetch("../data/businessTools.json")
  .then(res => res.json())
  .then(buildForm)
  .catch(err => console.error("フォーム生成失敗", err));


// フォーム構築
function buildForm(data) {
  const form = document.getElementById("dynamic-form");
  const actions = form.querySelector(".form-actions");

  data.form.forEach((item) => {
    const field = createField(item);
    form.insertBefore(field, actions);
  });

  setupValidation(form);
}


// フィールド作成
function createField(item) {
  const field = document.createElement("div");
  field.className = "form-item";

  const label = document.createElement("label");
  label.textContent = item.label;
  field.appendChild(label);

  const fieldCreators = {
    text: createTextInput,
    email: createTextInput,
    tel: createTextInput,
    url: createTextInput,
    number: createTextInput,
    textarea: createTextarea,
    select: createSelect,
    radio: createChoiceGroup,
    checkbox: createChoiceGroup,
  };

  const creator = fieldCreators[item.type];
  if (creator) {
    field.appendChild(creator(item));
  } else {
    console.warn("未対応のフィールドタイプ:", item.type);
  }

  return field;
}


// 枠生成_テキスト
function createTextInput(item) {
  const input = document.createElement("input");
  input.type = item.type;
  input.required = item.required;

  if (item.name) {
    input.name = item.name;
  }

  return input;
}


// 枠生成_テキストエリア
function createTextarea(item) {
  const textarea = document.createElement("textarea");
  textarea.required = item.required;
  textarea.rows = item.rows || 3;

  if (item.name) {
    textarea.name = item.name;
  }

  return textarea;
}


// 枠生成_プルダウン
function createSelect(item) {
  const select = document.createElement("select");
  select.required = item.required;

  if (item.name) {
    select.name = item.name;
  }

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "選択してください";
  placeholder.disabled = true;
  placeholder.selected = true;
  select.appendChild(placeholder);

  item.options.forEach(option => {
    const opt = document.createElement("option");
    opt.value = option;
    opt.textContent = option;
    select.appendChild(opt);
  });

  return select;
}


// 枠生成_ラジオボタン・チェックボックス
function createChoiceGroup(item) {
  const group = document.createElement("div");
  group.className = "choice-group";

  if (item.required) {
    group.dataset.required = "true";
  }

  item.options.forEach(option => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    const span = document.createElement("span");

    input.type = item.type;
    input.value = option;

    if (item.required && item.type === "radio") {
      input.required = true;
    }

    if (item.name) {
      input.name = item.name;
    }

    span.textContent = option;

    label.appendChild(input);
    label.appendChild(span);
    group.appendChild(label);
  });

  return group;
}


// バリデーション設定
function setupValidation(form) {
  const submitBtn = document.getElementById("submit-btn");

  // ページ読み込み時に一度更新
  updateValidation();

  form.addEventListener("change", updateValidation);

  function updateValidation() {
    form.querySelectorAll("input[type='text'], input[type='email'], input[type='tel'], input[type='url'], input[type='number']").forEach(input => {
      if (!input.required) return;
      input.classList.toggle("invalid", !input.value.trim());
    });

    form.querySelectorAll("textarea[required]").forEach(textarea => {
      textarea.classList.toggle("invalid", !textarea.value.trim());
    });

    form.querySelectorAll(".choice-group[data-required='true']").forEach(group => {
      const checked = [...group.querySelectorAll('input[type="radio"], input[type="checkbox"]')]
        .some(i => i.checked);

      group.classList.toggle("invalid", !checked);
    });

    const choiceValid = [...form.querySelectorAll(".choice-group[data-required='true']")]
      .every(group => [...group.querySelectorAll('input[type="radio"], input[type="checkbox"]')]
        .some(i => i.checked)
      );

    submitBtn.disabled = !(form.checkValidity() && choiceValid);
  }
}
