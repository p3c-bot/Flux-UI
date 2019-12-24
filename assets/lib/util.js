const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const numberForProgress = (x) => {
    return x.toString();
}

function playSound(filename) {
    var mp3Source = '<source src="' + 'doc-assets/' + filename + '.mp3" type="audio/mpeg">';
    var embedSource = '<embed hidden="true" autostart="true" loop="false" src="doc-assets/' + filename + '.mp3">';
    document.getElementById("sound").innerHTML = '<audio autoplay="autoplay">' + mp3Source + embedSource + '</audio>';
}

function displayError(errorString){
    alertify.defaults.notifier.delay = 10000
    alertify.error(errorString)
    $('#warning').transition({
        animation: 'shake',
        duration: '2s',
    });
    setInterval(function () {
        $('#warning').transition({
            animation: 'shake',
            duration: '2s',
        });
    }, 4000)
}

function getNetworkId(web3) {
    return new Promise((resolve, reject) => {
        // trust wallet doesnt allow accessing this variable.
        if (web3.currentProvider.publicConfigStore == undefined){
            resolve('61')
        }
        version = web3.currentProvider.publicConfigStore._state.networkVersion.toString();
        resolve(version)
    });
}

$.fn.draggable = function () {
    var $this = this,
        ns = 'draggable_' + (Math.random() + '').replace('.', ''),
        mm = 'mousemove.' + ns,
        mu = 'mouseup.' + ns,
        $w = $(window),
        isFixed = ($this.css('position') === 'fixed'),
        adjX = 0,
        adjY = 0;

    $this.mousedown(function (ev) {
        var pos = $this.offset();
        if (isFixed) {
            adjX = $w.scrollLeft();
            adjY = $w.scrollTop();
        }
        var ox = (ev.pageX - pos.left),
            oy = (ev.pageY - pos.top);
        $this.data(ns, {
            x: ox,
            y: oy
        });
        $w.on(mm, function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            if (isFixed) {
                adjX = $w.scrollLeft();
                adjY = $w.scrollTop();
            }
            var offset = $this.data(ns);
            $this.css({
                left: ev.pageX - adjX - offset.x,
                top: ev.pageY - adjY - offset.y
            });
        });
        $w.on(mu, function () {
            $w.off(mm + ' ' + mu).removeData(ns);
        });
    });

    return this;
};

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}