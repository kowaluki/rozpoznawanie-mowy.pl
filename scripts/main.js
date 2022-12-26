
    let recognition,synth, voices;
    let nagrywanaWiadomosc = false;
$(function(){
    firstBind();
    bind();
});
function firstBind() {
    $.ajax({
        url: "downloadUsers",
        method: "POST",
        success: function(e) {
            if(isJSON(e)) {
                let d = JSON.parse(e);
                $.each(d, function() {
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
    });
    $("#zadaj").click(()=>{otworzOpcje();});

    
    
}

function nagrywamy() {
    $("#nacisnij").text("🛑");
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
    }
   
    recognition.lang = "pl-PL";
    recognition.continuous = false;
    recognition.maxAlternatives = 5;
    recognition.interimResults = false;
    recognition.addEventListener('result', function(e){
        rozpoznajMowe(e);
        let wynik = e.results[0][0].transcript;
        zatrzymaj();
        recognition.stop();
    });
    recognition.start();
    recognition.addEventListener('audioend', function() {
        zatrzymaj();
        recognition.stop();
      });
}

function zatrzymaj() {
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
            godzina<10 ? godzina = "0"+godzina: godzina = godzina;
            let minuta = data.getMinutes();
            minuta<10 ? minuta = "0"+minuta: minuta = minuta;
            var utterThis = new SpeechSynthesisUtterance(godzina+":"+minuta);
            synth.speak(utterThis);
        break;
        case "dodaj wiadomość":
        case "napisz wiadomość":
            nagrywanaWiadomosc = true;
            setTimeout(function() {
                recognition.lang = "pl-PL";
                recognition.continuous = false;
                recognition.maxAlternatives = 3;
                recognition.interimResults = false;
                recognition.addEventListener('result', function(e){
                    dodajDoWiadomosci(e);
                    let wynik = e.results[0][0].transcript;
                    nagrywanaWiadomosc = false;
                    zatrzymaj();
                    recognition.stop();
                });
                recognition.start();
                recognition.addEventListener('audioend', function() {
                    zatrzymaj();
                    recognition.stop();
                  });
            },1500);
            close();
        break;
        case "lista pytań":
        case "kowalski opcje":
            otworzOpcje();
        break;
        case "zamknij listę pytań":
        case "zamknij pytania":
            $("#x").click();
        break;
        default:
        switch(true) {
            case wynik.includes("napisz do"):
                let drugiWynik = wynik.split("do ");
                drugiWynik.shift();
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
            case wynik.includes("usuń") && wynik.includes("z listy odbiorców"):
                let osta = wynik.split("usuń")[1].split("z listy odbiorców")[0].trim();
                let valuy = $("#select").val();
                let flagn = false;
                $.each($("#select").val(), function(){
                    if(String(this).trim()==String(osta).trim()) {
                        flagn = true;
                        let komunikat = new SpeechSynthesisUtterance("Usuwam "+osta+" z listy odbiorców.");
                        synth.speak(komunikat);
                        const index = valuy.indexOf(this);
                        const x = valuy.splice(index, 1);
                    }
                });
                if(flagn==false) {
                    let komunikat = new SpeechSynthesisUtterance("Nie ma takiego pracownika na liście odbiorców.");
                    synth.speak(komunikat);
                }
                $("#select").val(valuy).trigger("change");
            break;
            case wynik.includes("usuń") && wynik.includes("z listy"):
                let ostat = wynik.split("usuń")[1].split("z listy")[0].trim();
                let valuya = $("#select").val();
                let flag = false;
                $.each($("#select").val(), function(){
                    console.log(String(ostat).trim());
                    if(String(this).trim()==String(ostat).trim()) {
                        flag = true;
                        let komunikat = new SpeechSynthesisUtterance("Usuwam "+ostat+" z listy.");
                        synth.speak(komunikat);
                        const index = valuya.indexOf(this);
                        const x = valuya.splice(index, 1);
                    }
                    
                });
                if(flag==false) {
                        
                    let komunikatt = new SpeechSynthesisUtterance("Nie ma takiego pracownika na liście odbiorców.");
                    synth.speak(komunikatt);
                }
                $("#select").val(valuya).trigger("change");
            break;
            case wynik.includes("tak to jest"):
                let noTak = new SpeechSynthesisUtterance("No tak już jest i koniec. i nic nie poradzisz. Takie jest życie.");
                synth.speak(noTak);
            break;
            default:
                if(!nagrywanaWiadomosc) {
                    let nieRozumiem = new SpeechSynthesisUtterance("Nie rozumiem pytania. Powiedz: lista pytań, aby zobaczyć dostępne opcje.");
                    synth.speak(nieRozumiem);
                }
        }
            
    }
}

function otworzOpcje() {
    $("#listaPytan").fadeIn();
    xbind();
}

