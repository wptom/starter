import App from './modules/App';

document.addEventListener("DOMContentLoaded", function () {
    console.time('Executive time ES bundle');
    new App().init();
    console.timeEnd('Executive time ES bundle');    
});

