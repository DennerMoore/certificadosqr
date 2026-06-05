console.log("SCRIPT CARREGADO");

const SUPABASE_URL =
"https://ntxfyzdumgozwtyufoor.supabase.co";

const SUPABASE_KEY =
"SUA_CHAVE_AQUI";

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
new jsPDF();

pdf.setDrawColor(
0,
0,
0
);

pdf.rect(
10,
10,
190,
277
);

pdf.setFontSize(24);

pdf.text(
"CERTIFICADO",
65,
30
);

pdf.setFontSize(12);

pdf.text(
"Certificamos que:",
20,
55
);

pdf.setFontSize(18);

pdf.text(
dados.nome,
20,
70
);

pdf.setFontSize(12);

pdf.text(
`Empresa: ${dados.empresa}`,
20,
95
);

pdf.text(
`Curso: ${dados.curso}`,
20,
110
);

pdf.text(
`Data de emissão: ${dados.emissao}`,
20,
125
);

pdf.text(
`Validade: ${dados.validade}`,
20,
140
);

pdf.text(
`ID do certificado:`,
20,
160
);

pdf.setFontSize(10);

pdf.text(
dados.id,
20,
168
);

pdf.text(
`Hash SHA-256:`,
20,
185
);

pdf.setFontSize(8);

pdf.text(
dados.hash.substring(
0,
64
),
20,
193
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
135,
70,
45,
45
);

}

pdf.setFontSize(9);

pdf.text(
"Validação online:",
20,
230
);

pdf.text(
verifyUrl,
20,
238
);

pdf.line(
60,
255,
140,
255
);

pdf.setFontSize(10);

pdf.text(
"Assinatura",
90,
262
);

pdf.save(
`${dados.id}.pdf`
);

}
