document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.querySelector("form");
    const cadastrarBtn = document.querySelector("#cadastrar");
    const atualizarBtn = document.querySelector("#atualizar");
    const deletarBtn = document.querySelector(".deletar");
    const pesquisarBtn = document.querySelector(".pesquisar");
    const nomeInput = document.querySelector(".nome");
    const emailInput = document.querySelector(".email");
    const senhaInput = document.querySelector(".senha");
    const telefoneInput = document.querySelector("[name='tel']");
    const idInput = document.querySelector(".id");
    const limparBtn = document.querySelector(".limpar");
    const idadeInput = document.querySelector(".idade");
    const enderecoInput = document.querySelector(".endereco");
    const generateTableBtn = document.querySelector(".generate-table-btn");
    const tableBody = document.querySelector(".table-container tbody");
    const tableBox = document.querySelector(".table-box");
    const mainBox = document.querySelector(".box");
    const closeTableBtn = document.querySelector(".close-table-btn");
    const themeToggle = document.querySelector("#theme-toggle");
    const themeLabel = document.querySelector("#theme-label");
    const exportCsvBtn = document.querySelector(".export-csv-btn");

    themeToggle.addEventListener("change", function () {
        document.body.classList.toggle("dark-mode", themeToggle.checked);
        themeLabel.textContent = themeToggle.checked ? "Tema Escuro" : "Tema Claro";
    });

    function showToast(message, type = "success") {
        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
    
        setTimeout(() => {
            toast.classList.add("fade-out");
            toast.addEventListener("transitionend", () => toast.remove());
        }, 3000);
    }

    function cadastrar() { 
        if (!nomeInput.value || !emailInput.value || !senhaInput.value || !telefoneInput.value || !enderecoInput.value) {
            alert("Preencha todos os campos obrigatórios.");
            return; 
        } else {
            fetch("http://localhost:8080/usuarios", {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    nome: nomeInput.value,
                    email: emailInput.value,
                    senha: senhaInput.value,
                    telefone: telefoneInput.value,
                    endereco: enderecoInput.value,
                    idade: parseInt(idadeInput.value) || null
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao cadastrar usuário.");
                }
                return response.json();
            })
            .then(data => {
                console.log("Usuário cadastrado com sucesso:", data);
                showToast("Usuário cadastrado com sucesso!", "success");
                limpar();
            })
            .catch(error => {
                console.error("Erro ao cadastrar usuário:", error);
                alert(error.message);
            });
        }

        
        
    }

    function atualizar() {
        const id = parseInt(idInput.value);
        if (!id) {
            alert("Informe um ID para atualizar.");
            return;
        }

        fetch("http://localhost:8080/usuarios", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({
                id: id,
                nome: nomeInput.value,
                email: emailInput.value,
                senha: senhaInput.value,
                telefone: telefoneInput.value,
                endereco: enderecoInput.value,
                idade: parseInt(idadeInput.value) || null
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao atualizar usuário.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Usuário atualizado com sucesso:", data);
            alert("Usuário atualizado com sucesso!");
            limpar();
        })
        .catch(error => {
            console.error("Erro ao atualizar usuário:", error);
            alert(error.message);
        });

    }

    function pesquisar() {
        const id = idInput.value;
        if (!id) {
            alert("Informe um ID para pesquisar.");
            return;
        }

        fetch(`http://localhost:8080/usuarios/${id}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Usuário não encontrado');
            }
            return response.json();
        })
        .then(data => {
            // Preenche os campos com os dados do usuário
            nomeInput.value = data.nome || "";
            emailInput.value = data.email || "";
            senhaInput.value = data.senha || "";
            telefoneInput.value = data.telefone || "";
            idadeInput.value = data.idade || "";
            enderecoInput.value = data.endereco || "";

            // Atualiza a tabela para mostrar apenas o usuário pesquisado
            tableBody.innerHTML = ""; // Limpa a tabela
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${data.id}</td>
                <td>${data.nome}</td>
                <td>${data.idade}</td>
                <td>${data.email}</td>
                <td>${data.telefone}</td>
                <td>${data.endereco}</td>
            `;
            tableBody.appendChild(row);

            // Move a box principal levemente para a direita e exibe a tabela com animação
            mainBox.style.transform = "translateX(53%)";
            tableBox.classList.remove("hidden");
            tableBox.classList.add("active");
            generateTableBtn.textContent = "Mostrar Tabela Completa";

            if (generateTableBtn) {
                generateTableBtn.addEventListener("click", function () {
                    (limpar)();

                });
            }

            console.log("Usuário pesquisado:", data);
        })
        .catch(error => {
            console.error("Erro ao pesquisar usuário:", error);
            alert(error.message);  
        });
    }

    function pesquisarPorNome() {
        const nome = nomeInput.value;
        if (!nome) {
            alert("Informe um nome para pesquisar.");
            return;
        }
    
        fetch(`http://localhost:8080/usuarios/nome/${nome}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "GET",
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Nenhum usuário encontrado com esse nome.');
            }
            return response.json();
        })
        .then(data => {
            tableBody.innerHTML = ""; // Limpa a tabela
            data.forEach(usuario => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.idade}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.endereco}</td>
                `;
                tableBody.appendChild(row);
            });
    
            // Exibe a tabela
            mainBox.style.transform = "translateX(53%)";
            tableBox.classList.remove("hidden");
            tableBox.classList.add("active");
            generateTableBtn.textContent = "Mostrar Tabela Completa";
    
            console.log("Usuários encontrados:", data);
        })
        .catch(error => {
            console.error("Erro ao pesquisar usuários:", error);
            alert(error.message);
        });
    }
    
    // Adicionei um evento para o botão de pesquisar por nome
    const pesquisarPorNomeBtn = document.createElement("button");
    pesquisarPorNomeBtn.textContent = "Pesquisar por Nome";
    pesquisarPorNomeBtn.className = "pesquisar-nome";
    pesquisarPorNomeBtn.addEventListener("click", pesquisarPorNome);
    document.querySelector(".buttons-container").appendChild(pesquisarPorNomeBtn);

    function apagar() {
        const id = idInput.value;
        if (!id) {
            alert("Informe um ID para deletar.");
            return;
        }

        fetch(`http://localhost:8080/usuarios/${id}`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if (response.ok) {
                console.log(`Usuário com ID ${id} deletado com sucesso`);
                alert("Usuário deletado com sucesso!");
                limpar();
            } else {
                console.error("Erro ao deletar usuário:", response.statusText);
            }
        })
        .catch(error => console.error("Erro de rede:", error));
    }

    function limpar() {
        nomeInput.value = "";
        emailInput.value = "";
        senhaInput.value = "";
        telefoneInput.value = "";
        idadeInput.value = "";
        enderecoInput.value = "";
        idInput.value = "";
    }

    function gerarTabela() {
        fetch("http://localhost:8080/usuarios", {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            tableBody.innerHTML = ""; // Limpa a tabela antes de gerar
            data.forEach(usuario => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.idade}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>${usuario.endereco}</td>
                `;
                tableBody.appendChild(row);
            });

            // Move a box principal levemente para a direita e exibe a tabela com animação
            mainBox.style.transform = "translateX(53%)"; /* Move a box principal */
            tableBox.classList.remove("hidden");
            tableBox.classList.add("active");
            generateTableBtn.textContent = "Atualizar Tabela";

        })
        .catch(error => console.error("Erro ao gerar tabela:", error));
    }

    function exportarCSV() {
        const rows = Array.from(tableBody.querySelectorAll("tr"));
        if (rows.length === 0) {
            alert("Nenhum dado disponível para exportar.");
            return;
        }
    
        const csvContent = rows.map(row => {
            const cells = Array.from(row.querySelectorAll("td"));
            return cells.map(cell => `"${cell.textContent.replace(/"/g, '""')}"`).join(";"); // Usando ponto e vírgula como separador
        }).join("\n");
    
        const bom = "\uFEFF"; // Adiciona BOM para compatibilidade com Excel
        const csvBlob = new Blob([bom + csvContent], { type: "text/csv;charset=utf-8;" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const link = document.createElement("a");
        link.href = csvUrl;
        link.download = "usuarios.csv";
        link.click();
    }
    
    exportCsvBtn.addEventListener("click", exportarCSV);

    closeTableBtn.addEventListener("click", function () {
        // Esconde a tabela com animação e move a box principal de volta ao centro
        tableBox.classList.remove("active");
        tableBox.classList.add("hidden");
        mainBox.style.transform = "translateX(-50%)"; /* Move a box principal de volta ao centro */
        generateTableBtn.textContent = "Gerar Tabela";
    });

    formulario.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    cadastrarBtn.addEventListener("click", cadastrar);
    atualizarBtn.addEventListener("click", atualizar);
    deletarBtn.addEventListener("click", apagar);
    pesquisarBtn.addEventListener("click", pesquisar);
    limparBtn.addEventListener("click", limpar);
    generateTableBtn.addEventListener("click", gerarTabela);

    const menu = document.querySelector(".menu");
    const menuToggle = document.querySelector(".menu-toggle");

    menuToggle.addEventListener("click", function () {
        menu.classList.toggle("active");
    });
});
