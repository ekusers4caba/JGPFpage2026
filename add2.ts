function addNumbers(): void {

    const input1 = document.getElementById("number1") as HTMLInputElement;
    const input2 = document.getElementById("number2") as HTMLInputElement;
    const output = document.getElementById("result") as HTMLInputElement;

    const number1: number = Number(input1.value);
    const number2: number = Number(input2.value);

    const sum: number = number1 + number2;

    output.value = sum.toString();
}

document.getElementById("add-button")?.addEventListener("click", addNumbers);