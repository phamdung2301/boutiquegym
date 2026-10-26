(function () {
  var data = window.FORGE_DATA || { classes: [], schedule: [], coaches: [], memberships: [], testimonials: [] };
  function money(n) { return n.toLocaleString("vi-VN") + " đ"; }
  var list = document.getElementById("class-list");
  var countEl = document.getElementById("class-count");
  function renderClasses(type) {
    var shown = data.classes.filter(function (c) { return type === "all" || c.type === type; });
    if (list) {
      list.innerHTML = shown.map(function (c) {
        return "<article class='card'><h3>" + c.name + "</h3><p>" + c.desc + "</p><p>Cường độ: " + c.intensity + "</p><p class='price'>" + money(c.price) + " / buổi</p></article>";
      }).join("");
    }
    if (countEl) countEl.textContent = "Đang hiển thị " + shown.length + " / " + data.classes.length + " lớp.";
  }
  renderClasses("all");
  document.querySelectorAll(".filters .chip").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filters .chip").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      renderClasses(btn.getAttribute("data-type"));
    });
  });
  var sched = document.getElementById("schedule-list");
  if (sched) {
    sched.innerHTML = data.schedule.map(function (d) {
      return "<p><strong>" + d.day + ":</strong> " + d.items + "</p>";
    }).join("");
  }
  var coaches = document.getElementById("coach-list");
  if (coaches) {
    coaches.innerHTML = data.coaches.map(function (c) {
      return "<article class='card'><h3>" + c.name + "</h3><p><strong>" + c.role + "</strong></p><p>" + c.note + "</p></article>";
    }).join("");
  }
  var memb = document.getElementById("membership-box");
  if (memb) {
    memb.innerHTML = data.memberships.map(function (m) {
      return "<article class='card'><h3>" + m.name + "</h3><p class='price'>" + money(m.price) + " / tháng</p></article>";
    }).join("");
  }
  var testi = document.getElementById("testimonial-list");
  if (testi) {
    testi.innerHTML = data.testimonials.map(function (t) {
      return "<article class='card'><p>“" + t.text + "”</p><p><strong>" + t.name + "</strong></p></article>";
    }).join("");
  }
  var calcPlan = document.getElementById("calc-plan");
  var calcMonths = document.getElementById("calc-months");
  var calcResult = document.getElementById("calc-result");
  function updateCalc() {
    if (!calcPlan || !calcResult) return;
    var plan = data.memberships.find(function (m) { return m.id === calcPlan.value; }) || data.memberships[0];
    var months = parseInt(calcMonths ? calcMonths.value : "1", 10);
    var discount = months >= 6 ? 0.10 : (months >= 3 ? 0.05 : 0);
    var total = Math.round(plan.price * months * (1 - discount));
    calcResult.textContent = plan.name + " × " + months + " tháng: " + money(total) + (discount ? " (đã giảm " + Math.round(discount * 100) + "%)" : "");
  }
  if (calcPlan) {
    calcPlan.innerHTML = data.memberships.map(function (m) { return "<option value='" + m.id + "'>" + m.name + " — " + money(m.price) + "/tháng</option>"; }).join("");
    calcPlan.addEventListener("change", updateCalc);
    if (calcMonths) calcMonths.addEventListener("change", updateCalc);
    updateCalc();
  }
  var sel = document.getElementById("trial-class");
  if (sel) {
    sel.innerHTML = data.classes.map(function (c) { return "<option value='" + c.id + "'>" + c.name + "</option>"; }).join("");
  }
  var form = document.getElementById("trial-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(form);
      var out = document.getElementById("trial-result");
      if (fd.get("date")) {
        var today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(fd.get("date") + "T00:00:00") < today) { if (out) out.textContent = "Ngày đã qua — vui lòng chọn ngày từ hôm nay trở đi (demo)."; return; }
      }
      try { localStorage.setItem("forge-demo-trial", JSON.stringify({ name: fd.get("name"), cls: fd.get("class"), date: fd.get("date") })); } catch (err) {}
      if (out) out.textContent = "Đã lưu demo: " + fd.get("name") + " — " + fd.get("date") + ". Đây chưa phải đăng ký thật.";
    });
  }
  // Scroll progress
  window.addEventListener("scroll", function () {
    var bar = document.getElementById("progress-bar");
    if (!bar) return;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h * 100) : 0) + "%";
  }, { passive: true });
})();
