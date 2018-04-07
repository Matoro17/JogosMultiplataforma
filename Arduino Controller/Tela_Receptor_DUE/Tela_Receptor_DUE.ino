/*  
 Plataforma Arduino para Jogos de Quiz

 Autor: Gabriel Silva de Azevedo
 */
#include <string.h>
#include <IRremote2.h>
#include <TFT_HX8357_Due.h>

//Tela 
TFT_HX8357_Due tft = TFT_HX8357_Due();

//Receptor
const int RECV_PIN = 3;
IRrecv irrecv(RECV_PIN);
decode_results results;
String string="";

void setup() {
  //Setup tela
  tft.init();
  tft.setRotation(2);
  //Setup receptor
  Serial.begin(9600);
  Serial.setTimeout(50);
  irrecv.enableIRIn();
  irrecv.blink13(true);
  
}

void loop() {
  if (irrecv.decode(&results)){
        unsigned int value = results.value;
        String str = buto(value);
        if(sizeof str > 1){
          Serial.println(str);
        }
        irrecv.resume();
  }
  
  if (Serial.available()) {
    string = Serial.readString();
  }
  if(sizeof string > 1){
    tft.fillScreen(TFT_WHITE);
    tft.setCursor(0, 0, 2);
    tft.setTextColor(TFT_WHITE,TFT_BLACK);
    tft.print(string);
  }
  delay(50);
  
}

String nada(){
  return "nada";
}

String buto(unsigned int value){
  if(value == 0xFFE01F){
    return "menos";
  }
  else if(value == 0xFFA857){
    return "mais";
  }
  else if(value == 0xFF906F){
    return "EQ_";
  }
  else if(value == 0xFF9867){
    return "mais100";
  }
  else if(value == 0xFFB04F){
    return "mais200";
  }
  else if(value == 0xFF6897){
    return "zero";
  }
  else if(value == 0xFF30CF){
    return "um";
  }
  else if(value == 0xFF18E7){
    return "dois";
  }
  else if(value == 0xFF7A85){
    return "tres";
  }
  else if(value == 0xFF10EF){
    return "quatro";
  }
  else if(value == 0xFF38C7){
    return "cinco";
  }
  else if(value == 0xFF5AA5){
    return "seis";
  }
  else if(value == 0xFF42BD){
    return "sete";
  }
  else if(value == 0xFF4AB5){
    return "oito";
  }
  else if(value == 0xFF52AD){
    return "nove";
  }
  else{
    return "0";
  }

}

