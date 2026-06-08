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

async function gerarPDF(dados, verifyUrl) {
  document.getElementById("pdfNome").textContent = dados.nome;
  document.getElementById("pdfEmpresa").textContent = dados.empresa;
  document.getElementById("pdfCurso").textContent = dados.curso;
  document.getElementById("pdfEmissao").textContent = dados.emissao;
  document.getElementById("pdfValidade").textContent = dados.validade;
  document.getElementById("pdfId").textContent = dados.id;

  document.getElementById("pdfQr").innerHTML = "";
  new QRCode(document.getElementById("pdfQr"), {
    text: verifyUrl,
    width: 100,
    height: 100
  });

  const elemento = document.getElementById("certificadoPDF");

  // Posiciona visível mas fora da tela para o html2canvas renderizar corretamente
  elemento.style.display = "block";
  elemento.style.position = "fixed";
  elemento.style.top = "0";
  elemento.style.left = "-9999px";
  elemento.style.width = "794px";
  elemento.style.height = "1123px";
  elemento.style.overflow = "visible";

  // Aguarda QR renderizar
  await new Promise(r => setTimeout(r, 800));

  const canvas = await html2canvas(elemento.querySelector(".certificado"), {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    width: 794,
    height: 1123,
    windowWidth: 794,
    windowHeight: 1123,
    scrollX: 0,
    scrollY: 0
  });

  elemento.style.display = "none";
  elemento.style.position = "absolute";

  const imagem = canvas.toDataURL("image/png");
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("portrait", "mm", "a4");

  // A4 = 210 x 297mm
  const largura = pdf.internal.pageSize.getWidth();
const altura = pdf.internal.pageSize.getHeight();
pdf.addImage(imagem, "PNG", 0, 0, largura, altura);
  pdf.save(`Garantia-${dados.nome}.pdf`);
}
