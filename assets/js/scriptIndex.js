var logo = document.getElementById("logo")

logo.addEventListener("click", () =>{
    window.location.href = "./index.html";
} )


$("#botonSacarEntrada").click(function() {
  let timerInterval
  Swal.fire({
    title: "¡Disfruta de la magia del cine!",
    timer: 1000,
    timerProgressBar: false,
    didOpen: () => {
      Swal.showLoading()
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('I was closed by the timer')
      window.location.href = './cartelera.html';
    }
  });
})
