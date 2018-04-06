#include <ColorLCDShield.h>
LCDShield lcd;
int buttonPins[3] = {A0, A1, A2};  //You can add A3 ,A4 for button

void show(String palavra){
  lcd.clear(WHITE);
  lcd.setStr(palavra.c_str(), 0, 0, BLACK, WHITE);
}

void setup() {
  Serial.begin(9600);
  // put your setup code here, to run once:
  for (int i=0; i<3; i++)
  {
    pinMode(buttonPins[i], INPUT);
    digitalWrite(buttonPins[i], HIGH);
  }
  pinMode(10, OUTPUT);
  analogWrite(10, 1023); //PWM control blacklight
  /* Initialize the LCD, set the contrast, clear the screen */
  lcd.init(PHILLIPS);
  lcd.contrast(40);
  lcd.clear(WHITE);
}
//Colunas 16, linhas 16
void loop() {
  
  if (Serial.available() > 0) {
    String palavra = Serial.readString();
    show(palavra);
  }
}



