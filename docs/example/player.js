$('.loading').toggle();
var wav = new WaveFile();
var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'green',
    progressColor: 'white'
});

function handleFileSelect(evt) {
  $('.loading').toggle();
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;
  var reader = new FileReader();
  reader.onload = function() {
      wav.fromBuffer(new Uint8Array(this.result));
      loadFileInfo()
      if (wav.bitDepth == "8m") {
          wav.fromMuLaw();
      } else if (wav.bitDepth == "8a") {
          wav.fromALaw();
      } else if (wav.bitDepth == "4") {
          wav.fromIMAADPCM();
      }
      if (wav.container != "RIFF") {
        wav.toRIFF();
      }
      wav.toBitDepth("16");
      wavesurfer.load(wav.toDataURI());
      $('.loading').toggle();
  }
  reader.readAsArrayBuffer(files[0]);
}

function handleDragOver(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

function changeBitDepth() {
  var bitDepth = $('input[name=bit]:checked').val();
  if (bitDepth == "4") {
    wav.toIMAADPCM();
    loadFileInfo()
    wav.fromIMAADPCM();
  } else if(bitDepth == "8a") {
    wav.toALaw();
    loadFileInfo()
    wav.fromALaw();
  } else if(bitDepth == "8m") {
    wav.toMuLaw();
    loadFileInfo()
    wav.fromMuLaw();
  } else {
    wav.toBitDepth(bitDepth);
    loadFileInfo()
  }
  // Always 16-bit linear PCM so it can play in the browser
  wav.toBitDepth("16");
  wavesurfer.load(wav.toDataURI());
}

function changeContainer() {
  var container = $('input[name=container]:checked').val();
  if (container == "RIFX" && wav.container != "RIFX") {
    wav.toRIFX();
    loadFileInfo()
    wav.toRIFF();
  } else if (container == "RIFF") {
    wav.toRIFF();
    loadFileInfo()
  }
  wavesurfer.load(wav.toDataURI());
}

function loadFileInfo() {
    $("#chunkId").text(wav.container);
    $("#format").text(wav.format);
    $("#bitsPerSample").text(wav.fmt.bitsPerSample);
    $("#validBitsPerSample").text(wav.fmt.validBitsPerSample ? wav.fmt.validBitsPerSample : "Not applicable");
    $("#audioFormat").text(wav.fmt.audioFormat);
    $("#sampleRate").text(wav.fmt.sampleRate);
    $("#sampleCount").text(wav.data.samples.length);
}

// Setup the dnd listeners.
var dropZone = document.getElementById('drop-zone');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);