Ext.define('NU.controller.Classifier', {
    extend: 'NU.controller.Display',
    config: {
        rawContext: null,
        classifiedContext: null,
        frozen: false
    },
    control: {
        'rawImage': true,
        'classifiedImage': true,
        'target': true,
        'snapshot': {
            change: function (checkbox, newValue, oldValue, eOpts) {
                this.setFrozen(newValue);
            }
        }
    },
    init: function () {

        NU.util.Network.on('vision', Ext.bind(this.onVision, this));
        this.callParent(arguments);

        var elCanvas = this.getRawImage().getEl();
        var rawCanvas = elCanvas.dom;
        this.setRawContext(rawCanvas.getContext('2d'));
        this.mon(elCanvas, 'click', this.onRawImageClick, this);

        var classifiedCanvas = this.getClassifiedImage().getEl().dom;
        this.setClassifiedContext(classifiedCanvas.getContext('2d'));

    },
    onVision: function (robotIP, api_message) {

        // TODO: remove
        if (robotIP !== this.robotIP) {
            return;
        }

        var api_vision = api_message.vision;
        var image = api_vision.image;

        if (!this.getFrozen()) {
            this.drawImage(image);
        }

    },
    onRawImageClick: function (e, rawCanvas) {
        var el = Ext.get(rawCanvas);
        var x = e.getX() - el.getLeft();
        var y = e.getY() - el.getTop();

        var ctx = this.getRawContext();
        var idata = ctx.getImageData(x,y,1,1);
        var rgba = idata.data;

        var ycbcr = [0,0,0];

        //the digital RGB->YCC equations (RESTRICTION: luma is always >= 16)
        //ycbcr[0] = 16  + 0.25678906250 * rgba[0] + 0.50412890625 * rgba[1] + 0.09790625000 * rgba[2];
        //ycbcr[1] = 128 - 0.14822265625 * rgba[0] - 0.9099218750 * rgba[1] + 0.43921484375 * rgba[2];
        //ycbcr[2] = 128 + 0.43921484375 * rgba[0] - 0.36778906250 * rgba[1] - 0.07142578125 * rgba[2];

        //replaced with these RGB->YCC(jpg) equations
        ycbcr[0] =       0.299    * rgba[0] + 0.587    * rgba[1] + 0.114    * rgba[2];
        ycbcr[1] = 128 - 0.168736 * rgba[0] - 0.331264 * rgba[1] + 0.5      * rgba[2];
        ycbcr[2] = 128 + 0.5      * rgba[0] - 0.418688 * rgba[1] + 0.081312 * rgba[2];

        ycbcr[0] = Math.floor(ycbcr[0]);
        ycbcr[1] = Math.floor(ycbcr[1]);
        ycbcr[2] = Math.floor(ycbcr[2]);

        console.log(x, y);
        console.log(idata.data, this.getTarget().getValue());
        console.log(ycbcr);

        var clctx = this.getClassifiedContext();
        clctx.fillStyle = "rgb("+rgba[0]+", "+rgba[1]+", "+rgba[2]+")";

        clctx.fillRect(x,y,1,1);
    },
    drawImage: function (image) {
        this.drawImageB64(image);
    },
    drawImageB64: function (image) {
        var data = String.fromCharCode.apply(null, new Uint8ClampedArray(image.data.toArrayBuffer()));
        var uri = 'data:image/jpeg;base64,' + btoa(data);
        var imageObj = new Image();
        var ctx = this.getRawContext();
        imageObj.src = uri;
        imageObj.onload = function () {
            ctx.drawImage(imageObj, 0, 0, image.width, image.height);
        };
    }
});