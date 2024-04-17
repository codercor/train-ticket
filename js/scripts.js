import cities from "./cities.js";
import schedules from "./schedules.js";
import bookings from "./bookings.js";

const fromCity = document.getElementById("select-city-from");
const toCity = document.getElementById("select-city-to");

const searchButton = document.getElementById("search-button");
const dynamicContent = document.querySelector(".dynamic-content");

// when select a city from the fromCity dropdown, disable it in the toCity dropdown

fromCity.addEventListener("change", () => {
  for (let i = 0; i < toCity.options.length; i++) {
    toCity.options[i].disabled = false;
  }

  toCity.options[fromCity.selectedIndex].disabled = true;
});

toCity.addEventListener("change", () => {
  for (let i = 0; i < fromCity.options.length; i++) {
    fromCity.options[i].disabled = false;
  }

  fromCity.options[toCity.selectedIndex].disabled = true;
});

for (const city in cities) {
  const option = document.createElement("option");
  option.value = city;
  option.textContent = cities[city];
  const option2 = option.cloneNode(true);
  if (city === "1") {
    option.selected = true;
    option2.disabled = true;
  }
  if (city === "55") {
    option2.selected = true;
    option.disabled = true;
  }
  fromCity.appendChild(option);
  toCity.appendChild(option2);
}

// search button clicked list the train schedule

/* template

<section class="features-icons bg-light text-center">
        <div class="container">
          <div class="row">
            <div class="col-auto border">
              <h2 class="text-center text-white rounded-circle bg-primary p-3">
                SA
              </h2>
            </div>
            <div class="col border flex align-items-center">
              <p
                class="lead mb-0 text-center text-gray-500 font-weight-medium text-center"
              >
                6 hours 30 minutes
              </p>
            </div>
            <div class="col-auto border">
              <h2 class="text-center text-white rounded-circle bg-primary p-3">
                AD
              </h2>
            </div>
          </div>
          <div class="row border">
            <div class="col border flex align-items-center justify-content-center" style="min-width: 100px;max-width: 100px;">
              <img src="assets/img/seat.svg" alt="CAF" class="img-fluid w-100" style="height: 100px;" />
              <p class="lead mb-0 text-center text-gray-500 font-weight-medium">
                1
              </p>
            </div> 
          </div>
        </div>
      </section>

*/

searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  dynamicContent.innerHTML = "";
  const fromCityId = fromCity.value;
  const toCityId = toCity.value;
  const fromCityName = cities[fromCityId];
  const toCityName = cities[toCityId];
  const schedulesList = schedules.filter(
    (schedule) => schedule.from === fromCityId && schedule.to === toCityId
  );
  // before add section element to the dynamicContent, check if there is any schedule
  if (schedulesList.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No schedule found";
    dynamicContent.appendChild(p);
  } else {
    const section = document.createElement("section");
    section.classList.add("features-icons", "bg-light", "text-center");
    const container = document.createElement("div");
    container.classList.add("container");
    section.appendChild(container);
    for (const schedule of schedulesList) {
      const row = document.createElement("div");
      row.classList.add("row", "mt-4");
      container.appendChild(row);
      const col1 = document.createElement("div");
      col1.classList.add("col-auto", "border");
      row.appendChild(col1);
      const h2_1 = document.createElement("h2");
      h2_1.classList.add(
        "text-center",
        "text-white",
        "rounded-circle",
        "bg-primary",
        "p-3"
      );
      h2_1.textContent = fromCityName.substring(0, 2).toUpperCase();
      col1.appendChild(h2_1);
      const col2 = document.createElement("div");
      col2.classList.add("col", "border", "flex", "align-items-center");
      row.appendChild(col2);
      const p = document.createElement("p");
      p.classList.add(
        "lead",
        "mb-0",
        "text-center",
        "text-gray-500",
        "font-weight-medium",
        "text-center"
      );
      const days = Math.floor(schedule.estimatedDuration / 86400000);
      const hours = Math.floor(schedule.estimatedDuration / 3600000);
      const minutes = Math.floor(
        (schedule.estimatedDuration % 3600000) / 60000
      );

      p.textContent =
        days === 0
          ? ` ${hours} hours ${minutes} minutes`
          : ` ${days} days ${hours} hours ${minutes} minutes`;
      col2.appendChild(p);
      const col3 = document.createElement("div");
      col3.classList.add("col-auto", "border");
      row.appendChild(col3);
      const h2_2 = document.createElement("h2");
      h2_2.classList.add(
        "text-center",
        "text-white",
        "rounded-circle",
        "bg-primary",
        "p-3"
      );
      h2_2.textContent = toCityName.substring(0, 2).toUpperCase();
      col3.appendChild(h2_2);
      const row2 = document.createElement("div");
      row2.classList.add("row", "border");
      container.appendChild(row2);
      for (let i = 0; i < schedule.seatCount; i++) {
        const col4 = document.createElement("div");

        //if the seat is already booked, add the disabled
        const isBooked = bookings.some((booking) => {
          return (
            booking.from == fromCityId &&
            booking.to == toCityId &&
            booking.datetime == schedule.datetime &&
            booking.seat == i + 1
          );
        });
        if (isBooked) col4.setAttribute("disabled", true);

        col4.classList.add(
          "col",
          "border",
          "flex",
          "align-items-center",
          "justify-content-center",
          "seat"
        );
        col4.style.minWidth = "100px";
        col4.style.maxWidth = "100px";
        row2.appendChild(col4);
        const img = document.createElement("img");
        img.src = "assets/img/seat.svg";
        img.alt = "CAF";
        img.classList.add("img-fluid", "w-100");
        img.style.height = "100px";
        col4.appendChild(img);
        const p2 = document.createElement("p");
        p2.classList.add(
          "lead",
          "mb-0",
          "text-center",
          "text-gray-500",
          "font-weight-medium"
        );
        p2.textContent = i + 1;
        col4.appendChild(p2);
      }
    }
    dynamicContent.appendChild(section);
  }
});
