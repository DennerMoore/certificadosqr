console.log("SCRIPT CARREGADO");

const SUPABASE_URL =
"https://ntxfyzdumgozwtyufoor.supabase.co";

const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eGZ5emR1bWdvend0eXVmb29yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NjczNDEsImV4cCI6MjA5NjI0MzM0MX0.nL0kXMEsAdq9RC9QerUsf7xSnWUNegkYp4PGPkzQrKE";

const banco =
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
             .padStart(2,"0"))
        .join("");
}

function carregarImagem(src){

    return new Promise(
        (resolve,reject)=>{

            const img =
            new Image();

            img.crossOrigin =
            "anonymous";

            img.onload =
            () => resolve(img);

            img.onerror =
            reject;

            img.src = src;

        }
    );

}

async function gerarCertificado(){

    const certId =
    "CERT-" +
    crypto.randomUUID();

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
        "validade").value,

        ativo: true

    };

    dados.hash =
    await sha256(
    JSON.stringify(dados));

    const { error } =
    await banco
    .from("certificados")
    .insert([dados]);

    if(error){

        console.error(error);

        alert(
        "Erro ao salvar certificado"
        );

        return;
    }

    document
    .getElementById(
    "resultado")
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
    .getElementById(
    "qrcode")
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

    setTimeout(() => {

        gerarPDF(
            dados,
            verifyUrl
        );

    }, 700);

}

async function gerarPDF(
    dados,
    verifyUrl
){

    const { jsPDF } =
    window.jspdf;

    const pdf =
    new jsPDF(
        "portrait",
        "mm",
        "a4"
    );

    pdf.setLineWidth(
        1
    );

    pdf.rect(
        10,
        10,
        190,
        277
    );

    try{

        const logo =
        await carregarImagem(
            "./logo.png"
        );

        pdf.addImage(
            logo,
            "PNG",
            75,
            15,
            60,
            25
        );

    }
    catch(err){

        console.log(
            "Logo não encontrado"
        );

    }

    pdf.setFontSize(
        26
    );

    pdf.text(
        "CERTIFICADO",
        105,
        55,
        {
            align:"center"
        }
    );

    pdf.setFontSize(
        12
    );

    pdf.text(
        "Certificamos que",
        105,
        75,
        {
            align:"center"
        }
    );

    pdf.setFontSize(
        20
    );

    pdf.text(
        dados.nome,
        105,
        95,
        {
            align:"center"
        }
    );

    pdf.setFontSize(
        12
    );

    pdf.text(
        `Empresa: ${dados.empresa}`,
        20,
        125
    );

    pdf.text(
        `Curso: ${dados.curso}`,
        20,
        140
    );

    pdf.text(
        `Emissão: ${dados.emissao}`,
        20,
        155
    );

    pdf.text(
        `Validade: ${dados.validade}`,
        20,
        170
    );

    pdf.text(
        `ID: ${dados.id}`,
        20,
        185
    );

    const qrCanvas =
    document.querySelector(
        "#qrcode canvas"
    );

    if(qrCanvas){

        const qrImage =
        qrCanvas.toDataURL(
            "image/png"
        );

        pdf.addImage(
            qrImage,
            "PNG",
            140,
            115,
            40,
            40
        );

    }

    pdf.setFontSize(
        10
    );

    pdf.text(
        "Hash SHA-256",
        20,
        210
    );

    pdf.setFontSize(
        7
    );

    pdf.text(
        dados.hash,
        20,
        218,
        {
            maxWidth:170
        }
    );

    pdf.setFontSize(
        9
    );

    pdf.text(
        "Validação online:",
        20,
        245
    );

    pdf.text(
        verifyUrl,
        20,
        252,
        {
            maxWidth:170
        }
    );

    pdf.line(
        65,
        265,
        145,
        265
    );

    pdf.setFontSize(
        10
    );

    pdf.text(
        "Assinatura Digital",
        105,
        272,
        {
            align:"center"
        }
    );

    pdf.save(
        `${dados.id}.pdf`
    );

}
