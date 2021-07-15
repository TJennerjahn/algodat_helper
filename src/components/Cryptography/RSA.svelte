<script>
  import * as _ from "lodash";

  let p = 11;
  let q = 13;
  let n = p * q;
  let phi = (p - 1) * (q - 1);
  let e = 23;
  let d = 47;
  let k = -9;


  let publicKey = { e, n };
  let privateKey = { d, n };

  let m = 4;

  let encryptedMessage = (m ** e % n) % m;
  let decryptedMessage = (encryptedMessage ** d % n);

    console.log({
        p,
        q,
        n,
        phi,
        e,
        d,
        publicKey,
        privateKey,
        m,
        encryptedMessage,
        decryptedMessage
    });

  //   find a number that is coprime to phi
  function findCoprime(phi) {
    let coprime = 0;
    while (coprime < phi) {
      coprime++;
      if (gcd(coprime, phi) === 1) {
        return coprime;
      }
    }
  }

  // function to generate a random prime number
  function generatePrime(min, max) {
    var number = Math.floor(Math.random() * (max - min + 1)) + min;
    while (!isPrime(number)) {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    return number;
  }
  // function to check if a number is prime
  function isPrime(number) {
    if (number <= 1) {
      return false;
    }
    var i;
    for (i = 2; i <= Math.floor(Math.sqrt(number)); i++) {
      if (number % i === 0) {
        return false;
      }
    }
    return true;
  }

  // function to calculate greatest common divisor
  function gcd(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  }
</script>
