// const el = document.documentElement.appendChild(document.createElement("div"))
// el.style.width = "400px";
// el.style.height = "300px";
// el.style.position = "fixed";
// el.style.zIndex = "999999999999999999";
// el.style.background = "#7cff879e";
// el.style.border = "1px dashed #3d8b43";
// el.style.display = "flex"
// el.style.alignItems = "flex-end"
// el.style.justifyContent = "flex-end"

// const button = el.appendChild(document.createElement("button"));
// button.innerText = "Capture";
// button.style.border = "none";
// button.style.background = "#000000a6";
// button.style.color = "white";
// button.style.padding = "4px 8px";
// button.style.borderTopLeftRadius = "6px";

// button.addEventListener("click", async function () {
//   el.style.display = "none";
//   console.log(chrome);
  
//   // const stream = await navigator.mediaDevices.getDisplayMedia({
//   //   preferCurrentTab: true,
//   // });

//   // const vid = document.createElement("video");
//   // vid.addEventListener("loadedmetadata", function () {
//   //   const canvas = document.createElement("canvas");
//   //   const ctx = canvas.getContext("2d");
//   //   ctx.canvas.width = 400;
//   //   ctx.canvas.height = 300;
//   //   console.log(el.offsetLeft);
    
//   //   ctx.drawImage(vid, el.offsetLeft, el.offsetTop, vid.videoWidth, vid.videoHeight);

//   //   stream.getVideoTracks()[0].stop();

//   //   let a = document.createElement("a");
//   //   a.download = "image.png";
//   //   a.href = canvas.toDataURL("image/png", 1.0);
//   //   a.click();
//   // });
//   // vid.srcObject = stream;
//   // vid.play();
// })

// let moveX = 0;
// let moveY = 0;
// el.addEventListener('mousedown', (e) => {
//   e.preventDefault();
//   moveX = e.clientX;
//   moveY = e.clientY;
//   document.addEventListener("mouseup", () => {
//     document.removeEventListener("mousemove", onMove);
//   }, {once: true});
//   const onMove = (e) => {
//     e.preventDefault();
//     el.style.left = (el.offsetLeft - moveX + e.clientX) + "px";
//     el.style.top = (el.offsetTop - moveY + e.clientY) + "px";
//     moveX = e.clientX;
//     moveY = e.clientY;
//   };
//   document.addEventListener("mousemove", onMove)
// });
