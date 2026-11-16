// Offline fixture derived from the owner's 2026 festive menu image.
// No remote calls, no real products, no payment or customer data.
import assert from 'node:assert/strict';

const currency = 'EUR';
const dishes = {
  starters: [1150, 1400, 1400, 1200],
  mains: [1850, 2100, 2100],
  cheeses: [950, 850],
  desserts: [750, 800, 800],
};
const menus = [
  { name: 'Menu de fetes', cents: 4100, required: ['starter', 'main', 'dessert'] },
  { name: 'Menu complet', cents: 4700, required: ['starter', 'main', 'cheese', 'dessert'] },
];
let count = 0;
const check = (name, run) => {
  run();
  console.log('PASS ' + name);
  count++;
};
const formatTotal = (priceCents, quantity) => priceCents * quantity / 100;
const validSelections = (menu, selected) => menu.required.every(k => Number.isInteger(selected[k]) && selected[k] >= 0 && selected[k] < dishes[({starter:'starters',main:'mains',cheese:'cheeses',dessert:'desserts'})[k]].length);
check('12 a-la-carte dishes', () => assert.equal(Object.values(dishes).flat().length,12));
check('4/3/2/3 category distribution', () => assert.deepEqual(Object.values(dishes).map(x => x.length),[4,3,2,3]));
check('14 items including 2 menus', () => assert.equal(Object.values(dishes).flat().length + menus.length,14));
check('menu 41 EUR', () => assert.equal(menus[0].cents,4100));
check('menu 47 EUR', () => assert.equal(menus[1].cents,4700));
check('2 festive menus = 82 EUR', () => assert.equal(formatTotal(menus[0].cents,2),82));
check('3 complete menus = 141 EUR', () => assert.equal(formatTotal(menus[1].cents,3),141));
check('one of each = 88 EUR', () => assert.equal((menus[0].cents+menus[1].cents)/100,88));
check('2 duck mains = 42 EUR', () => assert.equal(formatTotal(dishes.mains[1],2),42));
check('every listed amount is positive integer cents',()=>Object.values(dishes).flat().forEach(p=>assert.ok(Number.isInteger(p)&&p>0)));
check('valid festive selection',()=>assert.equal(validSelections(menus[0],{starter:0,main:1,dessert:2}),true));
check('reject missing dessert',()=>assert.equal(validSelections(menus[0],{starter:0,main:1}),false));
check('reject wrong index',()=>assert.equal(validSelections(menus[0],{starter:19,main:1,dessert:0}),false));
check('complete menu requires cheese',()=>assert.equal(validSelections(menus[1],{starter:0,main:1,dessert:2}),false));
check('complete selection accepted',()=>assert.equal(validSelections(menus[1],{starter:0,main:1,cheese:0,dessert:2}),true));
check('never treat EUR price as TND',()=>assert.notEqual(currency,'TND'));
console.log(`${count}/${count} festive-menu fixture checks passed (offline only).`);
