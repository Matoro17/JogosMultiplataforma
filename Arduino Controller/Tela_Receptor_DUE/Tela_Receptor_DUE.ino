/*  
 Plataforma Arduino para Jogos de Quiz

 Autor: Gabriel Silva de Azevedo
 */

#include <IRremote2.h>
#include <TFT_HX8357_Due.h>

//Tela 
TFT_HX8357_Due tft = TFT_HX8357_Due();

//Receptor
const int RECV_PIN = 3;
IRrecv irrecv(RECV_PIN);
decode_results results;

void setup() {
  //Setup tela
  tft.init();
  tft.setRotation(2);
  //Setup receptor
  Serial.begin(9600);
  irrecv.enableIRIn();
  irrecv.blink13(true);
}

void loop() {
  if (irrecv.decode(&results)){

        Serial.println(results.value,HEX);
        String str = buto((results.value,HEX));
        
        Serial.print(str);
        irrecv.resume();
  }
  
  if (Serial.available() > 0) {
    tft.fillScreen(random(0xFFFF));
    tft.setCursor(0, 0, 2);
    tft.setTextColor(TFT_WHITE,TFT_BLACK);
    String string = Serial.readString();
    tft.println(string);
  }
  delay(50);
  
}
String buto(int code){

  
  if(code == 0xFFE01F){
    return "menos";
  }
  else if(code == 'FFA857'){
    return "mais";
  }
  else if(code == 'FF906F'){
    return "EQ";
  }
  else if(code == 'FF9867'){
    return "mais100";
  }
  else if(code == 'FFB04F'){
    return "mais200";
  }
  else if(code == 'FF6897'){
    return "zero";
  }
  else if(code == 'FF30CF'){
    return "um";
  }
  else if(code == 'FF18E7'){
    return "dois";
  }
  else if(code == 'FF7A85'){
    return "tres";
  }
  else if(code == 'FF10EF'){
    return "quatro";
  }
  else if(code == 'FF38C7'){
    return "cinco";
  }
  else if(code == 'FF5AA5'){
    return "seis";
  }
  else if(code == 'FF42BD'){
    return "sete";
  }
  else if(code == 'FF4AB5'){
    return "oito";
  }
  else if(code == 'FF52AD'){
    return "nove";
  }
  else{
    return "nada";
  }

}

