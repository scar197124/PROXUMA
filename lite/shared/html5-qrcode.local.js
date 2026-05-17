/* Proxuma local QR bridge — offline-first fallback for html5-qrcode CDN removal.
   Uses the browser's native BarcodeDetector when available. Manual paste remains the reliable offline path. */
(function(){
  if (window.Html5Qrcode) return;
  class Html5Qrcode {
    constructor(elementId){
      this.elementId = elementId;
      this.root = document.getElementById(elementId);
      this.stream = null;
      this.video = null;
      this.running = false;
      this._timer = null;
      this._detector = null;
    }
    static getSupportedFormats(){ return ['QR_CODE']; }
    _message(text){
      if(!this.root) return;
      this.root.innerHTML = '<div style="padding:12px;border:1px solid rgba(36,255,114,.35);border-radius:14px;color:#fff;background:rgba(0,0,0,.25);font-size:14px;line-height:1.45">'+text+'</div>';
    }
    async start(cameraConfig, config, onSuccess, onError){
      if(!('BarcodeDetector' in window)){
        this._message('Offline QR camera decoding is not supported by this browser. Paste the QR destination manually to scan fully offline.');
        throw new Error('BarcodeDetector unavailable');
      }
      if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
        this._message('Camera access is not available in this browser. Paste the QR destination manually to scan fully offline.');
        throw new Error('Camera unavailable');
      }
      this.running = true;
      this._detector = new BarcodeDetector({formats:['qr_code']});
      this.stream = await navigator.mediaDevices.getUserMedia({video: cameraConfig || {facingMode:'environment'}});
      this.video = document.createElement('video');
      this.video.setAttribute('playsinline','true');
      this.video.muted = true;
      this.video.srcObject = this.stream;
      this.video.style.width = '100%';
      this.video.style.maxWidth = '420px';
      this.video.style.borderRadius = '14px';
      if(this.root){ this.root.innerHTML=''; this.root.appendChild(this.video); }
      await this.video.play();
      const scan = async () => {
        if(!this.running) return;
        try{
          const codes = await this._detector.detect(this.video);
          if(codes && codes.length){
            const value = codes[0].rawValue || codes[0].rawData || '';
            if(value) onSuccess && onSuccess(value, codes[0]);
          }
        }catch(e){ onError && onError(String(e)); }
        this._timer = setTimeout(scan, Math.max(100, 1000/((config && config.fps) || 8)));
      };
      scan();
    }
    async stop(){
      this.running = false;
      if(this._timer) clearTimeout(this._timer);
      if(this.stream) this.stream.getTracks().forEach(t=>t.stop());
      this.stream = null;
      return Promise.resolve();
    }
    clear(){ if(this.root) this.root.innerHTML=''; }
    async scanFile(file, showImage){
      if(!('BarcodeDetector' in window)) throw new Error('BarcodeDetector unavailable');
      const detector = new BarcodeDetector({formats:['qr_code']});
      let bitmap;
      if('createImageBitmap' in window){ bitmap = await createImageBitmap(file); }
      else {
        bitmap = await new Promise((resolve,reject)=>{
          const img = new Image();
          img.onload=()=>resolve(img); img.onerror=reject;
          img.src=URL.createObjectURL(file);
        });
      }
      const codes = await detector.detect(bitmap);
      if(codes && codes.length) return codes[0].rawValue || codes[0].rawData || '';
      throw new Error('No QR code detected');
    }
  }
  window.Html5Qrcode = Html5Qrcode;
})();
