#include <ColorLCDShield.h>
#include <string.h>
LCDShield lcd;
int buttonPins[3] = {A0, A1, A2};  //You can add A3 ,A4 for button
char inicio[] = "BEM VINDO"; 
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
  lcd.clear(BLUE);
  
  lcd.setStr(inicio, 50, 15, WHITE, BLACK);

}
//Colunas 16, linhas 16
void loop() {
  
  if (Serial.available() > 0) {
    String string = Serial.readString();
    char* usedString = new char[string.length()];
    for(int index = 0; index < string.length(); index += 1){
      usedString[index] = string.charAt(index);
    }
    show(usedString);
  }
  
  
}

void show(char* palavra){
  lcd.clear(WHITE);
  int i=0, y=0;
  int pos = 15;
  printf("y: %i\t pos: %i",y, pos);
  while(i < (unsigned)strlen(palavra)){
    if(i == 16 || i == 32 ||  i == 48 || i == 64){
      y = y + 16;      
      pos = pos +15;
    }
    printf("y: %i\t pos: %i",y, pos);
    lcd.setChar(palavra[i + y], pos, (i+1)*8, BLACK, WHITE);
    i++;
  }
  
    
  
  
  
}

