if ("web3" in window) {
  var streamContract = web3.eth.contract(contracts.stream.abi).at(contracts.stream.address);
}

var videoID = getUrlVars()["id"];
var tipAmount = getUrlVars()["tip"];
var crop = getUrlVars()["crop"]

$.getJSON('https://api.p3c.io/tv/', function (json) {

  var params = JSON.parse(JSON.stringify(json));

  // check if any overrides 
  if (videoID && tipAmount && crop) {
    params.videoID = videoID
    params.tipAmount = tipAmount
    params.streamerAddress = crop
  }

  $('#done').text(' $' + (Number(params.tipAmount) / 100).toFixed(2));

  // iframe init
  var iframe = document.createElement("iframe");
  iframe.src = ("https://www.youtube.com/embed/" + params.videoID);
  iframe.frameborder = "0"
  iframe.allowfullscreen = "true"
  iframe.scrolling = "no"
  iframe.height = "" + window.innerHeight;
  iframe.width = "" + window.innerWidth;
  document.querySelector("#videoStream").innerHTML = "<iframe src='"+ iframe.src +"' height='360' width='100%'></iframe>";

  (params.tipAmount)
  document.querySelector("#done").innerHTML = "<i class='fas'></i>" + "$ " + params.tipAmount / 100 + "</a>"

  // Feed Hide/Show UI
  document.querySelector("#handle").addEventListener("click", function (e) {
    var feed = document.querySelector(".feed")
    feed.classList.toggle("collapsed")
    if (feed.classList.contains("collapsed")) {
      document.querySelector("#handle").innerHTML = "<i class='fas fa-angle-double-down'></i> Chat</a>"
    } else {
      document.querySelector("#handle").innerHTML = "<i class='fas fa-angle-double-up'></i> Hide</a>"
    }
    e.preventDefault()
  })

  document.querySelector("#done").addEventListener("click", function (e) {
    let message = document.querySelector("#msg").value
    if (message.length > 140) {
      alertify.error("Message limit is 140 characters.")
    } else {
      amount = Number(params.tipAmount) / (etcPriceUSD * 100)
      streamContract.tip.sendTransaction(
        message,
        // streamer crop, this is set in stone
        params.streamerAddress,
        myCropAddress, {
          from: web3.eth.accounts[0],
          // sometimes web3 returns decimal, maybe bug?
          value: Number(web3.toWei(amount, 'ether')).toFixed(0),
          gasPrice: web3.toWei(1, 'gwei')
        },
        function (error, result) { //get callback from function which is your transaction key
          if (!error) {
            console.log(result);
            alertify.success("New Tip! Sending Points to you and streamer.")

          } else {
            console.log(error);
          }
        })
    }
  })
});

var currentMessage = "Default"

function getMessage() {
  streamContract.message.call(function (err, result) {
    if (!err) {
      change = (String(currentMessage) !== String(result))
      if (change) {
        currentMessage = String(result)
        $("#broadcast").replaceWith("<b id='broadcast' class='count blink_me'>" + currentMessage + "</b>")
        $('#broadcast').transition({
          animation: 'flash',
          duration: '1s',
        });
      }
    }
  });
}