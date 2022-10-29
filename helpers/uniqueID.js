module.exports = () => {
var uniqueID = '';
var differentChars = 'abcdefghijklmnopqrstuvwxyz!@#$%^&*0123456789';

for ( var i = 0; i < 5; i++ ) {
  uniqueID += differentChars.charAt(Math.floor(Math.random() * differentChars.length));
}
return uniqueID;
}