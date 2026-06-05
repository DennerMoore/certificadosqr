console.log("SCRIPT CARREGADO");

const SUPABASE_URL =
"https://ntxfyzdumgozwtyufoor.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eGZ5emR1bWdvend0eXVmb29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjczNDEsImV4cCI6MjA5NjI0MzM0MX0.nL0kXMEsAdq9RC9QerUsf7xSnWUNegkYp4PGPkzQrKE";

const supabase =
window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

async function sha256(texto){

    const data =
    new TextEncoder().encode(texto);

    const hash =
    await crypto.subtle.digest(
        "SHA-256",
        data
    );

    return Array
        .from(new Uint8Array(hash))
        .map(b =>
             b.toString(16)
              .padStart(2,'0'))
        .join('');
}

async function gerarCertificado(){

    const certId =
    "CERT-" + crypto.randomUUID();

    const dados = {

        id: certId,

        nome:
        document.getElementById(
        "nome").value,

        empresa:
        document.getElementById(
        "empresa").value,

        curso:
        document.getElementById(
        "curso").value,

        emissao:
        document.getElementById(
        "emissao").value,

        validade:
        document.getElementById(
        "validade").value
    };

    dados.hash =
    await sha256(
    JSON.stringify(dados));

    await supabase
        .from("certificados")
        .insert([dados]);

    document
    .getElementById("resultado")
    .textContent =
    JSON.stringify(
        dados,
        null,
        2
    );

    const verifyUrl =
window.location.origin +
window.location.pathname.replace(
"index.html",
""
) +
"verify.html?id=" +
certId;

    document
    .getElementById("qrcode")
    .innerHTML = "";

    new QRCode(
        document.getElementById(
        "qrcode"),
        {
            text: verifyUrl,
            width:250,
            height:250
        }
    );
}
