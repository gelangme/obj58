//keep disabled for now
// const allVoicesObtained = new Promise(function (resolve, reject) {
//   let voices = window.speechSynthesis.getVoices();
//   if (voices.length !== 0) {
//     resolve(voices);
//   } else {
//     window.speechSynthesis.addEventListener("voiceschanged", function () {
//       voices = window.speechSynthesis.getVoices();
//       resolve(voices);
//     });
//   }
// });

// allVoicesObtained.then((voices) => console.log("All voices:", voices));
