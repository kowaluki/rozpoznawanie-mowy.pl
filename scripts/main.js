
    let recognition,synth, voices;
$(function(){
    firstBind();
    bind();
});
function firstBind() {
    $.ajax({
        url: "downloadUsers",
        method: "POST",
        success: function(e) {
            console.log(e);
            if(isJSON(e)) {
                let d = JSON.parse(e);
                console.log(d);
                $.each(d, function() {
                    console.log(this.dział);
                    $("#select").append("<optgroup label='"+this.dział+"'>");
                    $.each(this.osoby, function(){
                        $("#select").append("<option value='"+this.imie.toLowerCase()+"'>"+this.imie+"</option>");
                    });
                    $("#select").append("</optgroup>");
                });
            }
        }
    });
    $("#select").select2({
        width: '300px',
        placeholder: "Wybierz pracownika",
    });
}

function isJSON(json) {
    try {
        JSON.parse(json);
        return true;
    }
    catch {
        return false;
    }
}

function bind() {
    
    synth = window.speechSynthesis;
    voices = synth.getVoices();
    $("#nacisnij").click(()=> {
        let nagranie = nagrywamy();
        console.log(nagranie);
    });

    
    
}

function nagrywamy() {
    $("#nacisnij").text("stop");
    $("#nacisnij").off();
    $("#nacisnij").click(function(){
        recognition.stop();
        zatrzymaj();
    });
    try {
    recognition = new webkitSpeechRecognition();
    }
    catch(error) {
        alert(error);
        console.log(error);
    }
   
    recognition.lang = "pl-PL";
    recognition.continuous = false;
    recognition.maxAlternatives = 3;
    recognition.interimResults = false;
    recognition.addEventListener('result', function(e){
        rozpoznajMowe(e);
        console.log(e.results);
        let wynik = e.results[0][0].transcript;
        zatrzymaj();
        recognition.stop();
    });
    recognition.start();
    recognition.addEventListener('audioend', function() {
        console.log('Speech recognition service disconnected');
        zatrzymaj();
        recognition.stop();
      });
}

function zatrzymaj() {
    console.log("ZATRZYMYWANIE");
    $("#nacisnij").text("🎤");
    bind();
}

function dodajDoWiadomosci(result) {
    let wynik = result.results[0][0].transcript.toLowerCase();
    $("#textarea").val(wynik);
}
function xbind() {
    $("#x").click(()=>{
        $("#x").off();
        $("#listaPytan").stop().fadeOut();
        xbind();
    });
}

function rozpoznajMowe(result) {
    
    let wynik = result.results[0][0].transcript.toLowerCase();
    switch(wynik) {
        case "która godzina":
        case "która godzina?":
        case "która jest godzina":
        case "która jest godzina?":    
        case "jaki czas":
        case "jaki czas?":
        case "jaka jest godzina":
        case "jaka jest godzina?":
        case "jaka godzina":
        case "jaka godzina?":
            let data = new Date();
            let godzina = data.getHours();
            let minuta = data.getMinutes();
            var utterThis = new SpeechSynthesisUtterance(godzina+":"+minuta);
            synth.speak(utterThis);
        break;
        case "dodaj wiadomość":
        case "napisz wiadomość":
            setTimeout(function() {
                recognition.lang = "pl-PL";
                recognition.continuous = false;
                recognition.maxAlternatives = 3;
                recognition.interimResults = false;
                recognition.addEventListener('result', function(e){
                    dodajDoWiadomosci(e);
                    console.log(e.results);
                    let wynik = e.results[0][0].transcript;
                    zatrzymaj();
                    recognition.stop();
                });
                recognition.start();
                recognition.addEventListener('audioend', function() {
                    console.log('Speech recognition service disconnected');
                    zatrzymaj();
                    recognition.stop();
                  });
            },1500);
            

        break;
        case "lista pytań":
            $("#listaPytan").fadeIn();
            xbind();
        break;
        default:
        switch(true) {
            case wynik.includes("napisz do"):
                let drugiWynik = wynik.split("do ");
                drugiWynik.shift();
                console.log(drugiWynik);
                let utterThis;
                let flaga = false;
                $.each($("#select option"), function() {
                    if($(this).val()==drugiWynik[0]) {
                        flaga = true;
                    }
                });
                if(flaga==true) {
                    let wyniki = $("#select").val();
                    wyniki.push(drugiWynik);
                    $("#select").val(wyniki);
                    $("#select").trigger("change");
                    utterThis = new SpeechSynthesisUtterance("Dodaję "+drugiWynik+" do listy odbiorców.");
                    synth.speak(utterThis);
                }
                else {
                    utterThis = new SpeechSynthesisUtterance("Nie ma "+drugiWynik+" na liście pracowników.");
                    synth.speak(utterThis);
                }
            break;
            default:
            let nieRozumiem = new SpeechSynthesisUtterance("Nie rozumiem pytania. Powiedz: lista pytań, aby zobaczyć dostępne opcje.");
            synth.speak(nieRozumiem);
        }
            
    }
}

