function myFunc() {
  const n = 5;

  if (n > 0) {
    if (n === 5) {
      console.log(5);
      return
    }
    console.log("positive")
  }

  console.log("done")
}
