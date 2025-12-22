export const restaurants=[
  {id:'r-otoro',name:'Otoro · Urban Omakase',city:'Helsinki',capacity:32,tags:['Sushi','Omakase']},
  {id:'r-lobo',name:'LOBO · Nordic × Mediterranean',city:'Helsinki',capacity:64,tags:['Tasting','Wine']}
]

export const tables=[
  {id:'t-1',label:'Counter',seats:6},
  {id:'t-2',label:'Window',seats:2},
  {id:'t-3',label:'Center',seats:4},
  {id:'t-4',label:'Booth',seats:6}
]

const names=['Aina','Sergio','Mika','Arina','Lucía','Noah','Aya','Hugo','Sara','Leo','Olga','Jon'];
const notes=['Allergies: nuts','Anniversary','Vegetarian','High chair','Window request','Omakase'];

export function seedBookings(count=18){
  const now=Date.now();
  const out=[];
  for(let i=0;i<count;i++){
    const when=new Date(now+(i-6)*36e5+(i%3)*9e5);
    const size=2+(i%5);
    out.push({
      id:`b-${i+1}`,
      guest:names[(i*3)%names.length],
      partySize:size,
      time:when.toISOString(),
      status:(i%7===0)?'No-show risk':(i%4===0?'Pending':'Confirmed'),
      channel:(i%2===0)?'Widget':'Phone',
      table:tables[i%tables.length].id,
      note:notes[i%notes.length]
    });
  }
  return out;
}
