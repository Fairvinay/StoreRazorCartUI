 // window.addEventListener('resize', sendHeightToParent);
    // CHECK the webpage is being inside a iFrame  then , on Payment 
    // enclose the payment_id from razor Pay in a href link 
    function inIframe () {
    try {
        return window.self !== window.top;
      } catch (e) {
        return true;
     }
    }

   (function () {

     let isInFrame = inIframe();// true;

     if(isInFrame) {
      setTimeout( () => {
        let payId = document.getElementById("payId");
        let payDiv  = document.getElementById("payDiv");
        if(payId && payDiv){
             console.log("payId present ");
            var link = document.createElement("a");
            const payment_id = payId.innerText;
            //https://storenotify.in/customeronboard?payment_id=pay_QE48dW5Tgq42SA 
            let host =  window.location.hostname;
            let url = "https://"+host+"/customeronboard?payment_id="+payment_id;
            console.log("pay link "+url);
            link.setAttribute("style"," font-weight: bold;color: deepskyblue;")
            link.setAttribute("href",url);
           link.appendChild(payId);
            payDiv.appendChild(link);
            
        }

      } , 3000);
       
        console.log("Checkout inside a parent ");
     }
     else{
         console.log("Checkout separated ");
     }

   })(); 