import ProfileForm from "@/components/dashboard/ProfileForm"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configurações</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e preferências.
        </p>
      </div>

      <div className="glass-card p-6 rounded-xl max-w-2xl">
        <div className="mb-6">
          <h3 className="text-lg font-medium">Perfil</h3>
          <p className="text-sm text-muted-foreground">
            Atualize suas informações básicas.
          </p>
        </div>
        
        <ProfileForm />
      </div>
    </div>
  )
}
