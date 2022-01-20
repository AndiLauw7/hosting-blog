function submitData() {
    let nama = document.getElementById("nama").value
    let telpon = document.getElementById("telpon").value
    let email = document.getElementById("email").value
    let Subject = document.getElementById("Subject").value
    let textarea = document.getElementById("textarea").value

    console.log(nama);
    console.log(telpon);
    console.log(email);
    console.log(Subject);
    console.log(textarea);

    //    var data = document.getElementById("nama").value;

    // function biodata() {
    //   // ini adalah local scope, dan kita
    //   // dapat mendeklarasikan variable data secara local
    //   var data = document.getElementById("telpon").value;
    //   console.log(data); // 'hijau'
    // }

    // biodata();

    // console.log(data);
    // var nama = document.getElementById("nama").value
    // var telon = document.getElementById("telpon").value
    // console.log(nama);
    // console.log(telpon);

    if (document.getElementById('html').checked &
        document.getElementById("css").checked &
        document.getElementById("git").checked &
        document.getElementById("js").checked) {
        console.log(document.getElementById('html').value +
            document.getElementById("css").value +
            document.getElementById("git").value +
            document.getElementById("js").value)
    } else if (document.getElementById('html').checked) {
        console.log(document.getElementById('html').value)
    } else if (document.getElementById('css').checked) {
        console.log(document.getElementById('css').value)
    } else if (document.getElementById('git').checked) {
        console.log(document.getElementById('git').value)
    } else if (document.getElementById('js').checked) {
        console.log(document.getElementById('js').value)
    } else {
        alert("Harap pilih Checkbox")
    }

    // KONDISI FORM INPUT
    if (nama == "") {
        return alert("nama tidak boleh kosong")
    } else if (telpon == " ") {
        return alert("Telpon tidak boleh kosong")
    } else if (email == "") {
        return alert("email tidak boleh kosong")
    } else if (Subject == "") {
        return alert("Subject harus diisi ")
    } else if (textarea == "") {
        return alert("Massagge Harus di isi")
    }

    let emailReceiver = 'andisafariansyah7@gmail.com'
    let a = document.createElement('a')
    a.href = `mailto: ${emailReceiver}?subject=${Subject}&body=Hallo my name ${nama}  ${textarea} contact me ${telpon}`
    a.click()
        // if (name == '' || email == '' || phone == '' || subject == '' || message == '') {
        //     alert("Semuanya wajib diisi")
        // }
    let dataObject = {
        nama: nama,
        telpon: telpon,
        email: email,
        html: html,
        css: css,
        git: git,
        js: js,
        Subject: Subject,
        textarea: textarea
    }
    console.log(dataObject)

    // if (document.getElementById('cek').checked);
    // console.log(document.getElementById('cek').value );

}