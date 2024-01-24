import { txPull, txAvailableLanguages } from "./transifex.js";
const languages = await txAvailableLanguages("scratch-addons-extension");
// const data = await txPull(
//   "scratch-addons-extension",
//   "addons-translation-new",
//   "es",
// );
console.log(languages);
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/vnd.api+json',
//     authorization: 'Bearer 1/47205a94b5a79e008f338a921ef295581f2c3c07'
//   }
// };
// const slug = "o:scratch-addons:p:scratch-addons-extension";
// // fetch(`https://rest.api.transifex.com/projects/${slug}/languages`, options)
// //   .then(response => response.json())
// //   .then(response => console.log(response))
// //   .catch(err => console.error(err));
//   fetch(`https://rest.api.transifex.com/resources?filter[project]=${slug}`, options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err));
