

function Corpus(name){
    this.name= name;
    data = {
        name: this.name,
      locale: "en-US",
      data: [
          {
              intent:`hello`,
              utterances:[
                  "hi",
                  "hello",
                  "how are you",
                  "what is going on",
                  "what's up"
              ],
              answers:[
                  "hi , welcome to new day",
                  "thank you for asking , what about you"
              ]
          }
      ]
    
    };
    return data;

}



module.exports = Corpus;