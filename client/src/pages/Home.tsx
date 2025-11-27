import { useEffect, useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Edit2, Trash2, Plus } from "lucide-react";

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(val / 100);

const STATUS_OPTIONS = [
  { value: "Pago", label: "Pago", color: "bg-green-100 text-green-800 border-green-500" },
  { value: "Pendente", label: "Pendente", color: "bg-yellow-100 text-yellow-800 border-yellow-500" },
  { value: "Aguardando Alvará", label: "Aguardando Alvará", color: "bg-blue-100 text-blue-800 border-blue-500" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"pagamentos" | "despesas">("pagamentos");
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [showExpForm, setShowExpForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<any>(null);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Todos");
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Queries
  const funcionariosQuery = trpc.funcionarios.list.useQuery();
  const despesasQuery = trpc.despesas.list.useQuery();

  // Mutations
  const createFuncionarioMut = trpc.funcionarios.create.useMutation();
  const updateFuncionarioMut = trpc.funcionarios.update.useMutation();
  const deleteFuncionarioMut = trpc.funcionarios.delete.useMutation();

  const createDespesaMut = trpc.despesas.create.useMutation();
  const updateDespesaMut = trpc.despesas.update.useMutation();
  const deleteDespesaMut = trpc.despesas.delete.useMutation();

  const showToast = (msg: string, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const employees = funcionariosQuery.data || [];
  const expenses = despesasQuery.data || [];

  // Cálculos
  const totalCollected = useMemo(
    () =>
      employees
        .filter((e) => e.status === "Pago")
        .reduce((acc, e) => acc + e.valor_contribuicao, 0),
    [employees]
  );

  const totalPending = useMemo(
    () =>
      employees
        .filter((e) => e.status !== "Pago")
        .reduce((acc, e) => acc + e.valor_contribuicao, 0),
    [employees]
  );

  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + e.valor, 0), [expenses]);
  const balance = totalCollected - totalExpenses;

  // Filtros
  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      const matchesSearch = e.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "Todos" || e.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [employees, searchTerm, filterStatus]);

  // Handlers
  const handleSaveEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const nome = formData.get("nome") as string;
    const valor = parseFloat(formData.get("valor") as string);
    const status = (formData.get("status") as string) || "Pendente";

    try {
      if (editingEmployee) {
        await updateFuncionarioMut.mutateAsync({
          id: editingEmployee.id,
          nome,
          valor_contribuicao: Math.round(valor * 100),
          status: status as any,
        });
        showToast("Funcionário atualizado!", "success");
      } else {
        await createFuncionarioMut.mutateAsync({
          nome,
          valor_contribuicao: Math.round(valor * 100),
          status: status as any,
        });
        showToast("Funcionário criado!", "success");
      }
      setShowEmpForm(false);
      setEditingEmployee(null);
      funcionariosQuery.refetch();
    } catch (error: any) {
      showToast(`Erro: ${error.message}`, "error");
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!window.confirm("Remover este funcionário?")) return;
    try {
      await deleteFuncionarioMut.mutateAsync({ id });
      showToast("Funcionário removido!", "success");
      funcionariosQuery.refetch();
    } catch (error: any) {
      showToast(`Erro: ${error.message}`, "error");
    }
  };

  const handleSaveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item = formData.get("item") as string;
    const valor = parseFloat(formData.get("valor") as string);
    const data_compra = formData.get("data") as string;

    try {
      if (editingExpense) {
        await updateDespesaMut.mutateAsync({
          id: editingExpense.id,
          item,
          valor: Math.round(valor * 100),
          data_compra,
        });
        showToast("Despesa atualizada!", "success");
      } else {
        await createDespesaMut.mutateAsync({
          item,
          valor: Math.round(valor * 100),
          data_compra,
        });
        showToast("Despesa criada!", "success");
      }
      setShowExpForm(false);
      setEditingExpense(null);
      despesasQuery.refetch();
    } catch (error: any) {
      showToast(`Erro: ${error.message}`, "error");
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!window.confirm("Apagar despesa?")) return;
    try {
      await deleteDespesaMut.mutateAsync({ id });
      showToast("Despesa removida!", "success");
      despesasQuery.refetch();
    } catch (error: any) {
      showToast(`Erro: ${error.message}`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      {/* HEADER */}
      <header className="bg-indigo-900 text-white p-4 sticky top-0 z-20 shadow-lg border-b-4 border-yellow-500">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg
              className="w-8 h-8 text-yellow-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h1 className="text-xl font-bold leading-tight">Confraternização</h1>
              <p className="text-xs text-yellow-400 font-semibold tracking-wider">Liderança BP</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setActiveTab("pagamentos");
                setIsSharing(false);
              }}
              className={`px-3 py-1 rounded text-sm font-bold ${
                activeTab === "pagamentos"
                  ? "bg-yellow-500 text-indigo-900"
                  : "bg-indigo-800 text-gray-300"
              }`}
            >
              Pagos
            </button>
            <button
              onClick={() => {
                setActiveTab("despesas");
                setIsSharing(false);
              }}
              className={`px-3 py-1 rounded text-sm font-bold ${
                activeTab === "despesas"
                  ? "bg-yellow-500 text-indigo-900"
                  : "bg-indigo-800 text-gray-300"
              }`}
            >
              Gastos
            </button>
          </div>
        </div>
      </header>

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-20 right-4 px-4 py-2 rounded shadow-xl text-white font-bold z-50 transition duration-300 ease-in-out ${
            toast.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {toast.msg}
        </div>
      )}

      <main className="max-w-6xl mx-auto p-4">
        {/* CARDS DE RESUMO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 border-l-4 border-indigo-600">
            <p className="text-xs text-gray-500 uppercase font-bold">Arrecadado</p>
            <p className="text-xl md:text-2xl font-black text-indigo-900">{formatCurrency(totalCollected)}</p>
          </Card>
          <Card className="p-4 border-l-4 border-yellow-500">
            <p className="text-xs text-gray-500 uppercase font-bold">Pendente</p>
            <p className="text-xl md:text-2xl font-black text-yellow-600">{formatCurrency(totalPending)}</p>
          </Card>
          <Card className="p-4 border-l-4 border-red-500">
            <p className="text-xs text-gray-500 uppercase font-bold">Despesas</p>
            <p className="text-xl md:text-2xl font-black text-red-600">{formatCurrency(totalExpenses)}</p>
          </Card>
          <Card className={`p-4 border-l-4 ${balance >= 0 ? "border-green-500" : "border-red-600"}`}>
            <p className="text-xs text-gray-500 uppercase font-bold">Saldo</p>
            <p className={`text-xl md:text-2xl font-black ${balance >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(balance)}
            </p>
          </Card>
        </div>

        {/* ABA PAGAMENTOS */}
        {activeTab === "pagamentos" && (
          <section>
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="🔍 Buscar nome..."
                className="w-full md:w-auto flex-1 p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option>Todos</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => setIsSharing(!isSharing)}
                  className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700"
                >
                  {isSharing ? "Fechar Resumo" : "WhatsApp"}
                </button>
                <button
                  onClick={() => {
                    setEditingEmployee(null);
                    setShowEmpForm(!showEmpForm);
                  }}
                  className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-indigo-700"
                >
                  {showEmpForm ? "Fechar" : "+ Novo"}
                </button>
              </div>
            </div>

            {/* Formulário Funcionário */}
            {(showEmpForm || editingEmployee) && (
              <form onSubmit={handleSaveEmployee} className="bg-indigo-50 p-4 rounded-xl shadow-inner mb-4 border border-indigo-200">
                <h3 className="font-bold text-indigo-900 mb-2">{editingEmployee ? "Editar" : "Adicionar"} Funcionário</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    name="nome"
                    defaultValue={editingEmployee?.nome}
                    required
                    placeholder="Nome Completo"
                    className="p-2 rounded border"
                  />
                  <input
                    name="valor"
                    type="number"
                    step="0.01"
                    defaultValue={editingEmployee ? editingEmployee.valor_contribuicao / 100 : 100}
                    required
                    placeholder="Valor R$"
                    className="p-2 rounded border"
                  />
                  {editingEmployee && (
                    <select name="status" defaultValue={editingEmployee.status} className="p-2 rounded border">
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  )}
                  <button type="submit" className="md:col-span-3 bg-yellow-500 text-indigo-900 font-bold py-2 rounded shadow hover:bg-yellow-400">
                    Salvar
                  </button>
                </div>
              </form>
            )}

            {/* Card de Compartilhamento */}
            {isSharing && (
              <Card className="p-6 mb-6 border-y-8 border-indigo-600">
                <h2 className="text-xl font-black text-center text-indigo-900 mb-4">STATUS FINANCEIRO - LIDERANÇA BP</h2>
                <div className="flex justify-around mb-4 border-b pb-4">
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-500">PAGO</div>
                    <div className="text-xl font-black text-green-600">{formatCurrency(totalCollected)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-gray-500">PENDENTE</div>
                    <div className="text-xl font-black text-yellow-600">{formatCurrency(totalPending)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {employees.map((e) => (
                    <div key={e.id} className="flex justify-between border-b border-gray-100 pb-1">
                      <span>{e.nome}</span>
                      <span className={`font-bold ${e.status === "Pago" ? "text-green-600" : "text-yellow-600"}`}>
                        {e.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-center text-xs text-gray-400 mt-4">Tire um print e compartilhe!</p>
              </Card>
            )}

            {/* Lista Funcionários */}
            <div className="space-y-3">
              {funcionariosQuery.isLoading ? (
                <p className="text-center p-4">Carregando...</p>
              ) : (
                filteredEmployees.map((emp) => (
                  <Card key={emp.id} className="p-4 border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{emp.nome}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(emp.valor_contribuicao)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer select-none ${
                          STATUS_OPTIONS.find((s) => s.value === emp.status)?.color
                        }`}
                      >
                        {emp.status}
                      </button>
                      <button
                        onClick={() => {
                          setEditingEmployee(emp);
                          setShowEmpForm(true);
                        }}
                        className="p-2 text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* ABA DESPESAS */}
        {activeTab === "despesas" && (
          <section>
            <button
              onClick={() => {
                setEditingExpense(null);
                setShowExpForm(!showExpForm);
              }}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold shadow mb-4 hover:bg-red-700"
            >
              {showExpForm ? "Cancelar" : "Registrar Nova Despesa"}
            </button>

            {(showExpForm || editingExpense) && (
              <form onSubmit={handleSaveExpense} className="bg-red-50 p-4 rounded-xl shadow-inner mb-4 border border-red-200">
                <div className="grid grid-cols-1 gap-3">
                  <input
                    name="item"
                    defaultValue={editingExpense?.item}
                    required
                    placeholder="Descrição do Item (Ex: Buffet)"
                    className="p-2 rounded border"
                  />
                  <div className="flex gap-2">
                    <input
                      name="valor"
                      type="number"
                      step="0.01"
                      defaultValue={editingExpense ? editingExpense.valor / 100 : ""}
                      required
                      placeholder="Valor R$"
                      className="p-2 rounded border flex-1"
                    />
                    <input
                      name="data"
                      type="date"
                      defaultValue={editingExpense?.data_compra || new Date().toISOString().split("T")[0]}
                      required
                      className="p-2 rounded border flex-1"
                    />
                  </div>
                  <button type="submit" className="bg-red-600 text-white font-bold py-2 rounded shadow hover:bg-red-700">
                    Salvar Despesa
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {despesasQuery.isLoading ? (
                <p className="text-center p-4">Carregando...</p>
              ) : expenses.length === 0 ? (
                <p className="text-center text-gray-400 mt-4">Nenhuma despesa registrada.</p>
              ) : (
                expenses.map((exp) => (
                  <Card key={exp.id} className="p-4 border-l-4 border-red-400 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{exp.item}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(exp.data_compra + "T00:00:00").toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-bold text-red-600">{formatCurrency(exp.valor)}</p>
                      <button
                        onClick={() => {
                          setEditingExpense(exp);
                          setShowExpForm(true);
                        }}
                        className="text-indigo-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteExpense(exp.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
