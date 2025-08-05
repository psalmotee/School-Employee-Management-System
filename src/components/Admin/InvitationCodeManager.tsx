"use client"

import type React from "react"
import { useState } from "react"
import { Plus, Copy, Trash2, Clock, CheckCircle, Key, Users, Shield } from "lucide-react"
import { format } from "date-fns"
import { useInvitationCodes } from "../../hooks/useInvitationCodes"
import { useAuth } from "../../contexts/AuthContext"

const InvitationCodeManager: React.FC = () => {
  const [showGenerateModal, setShowGenerateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<"admin" | "manager">("manager")
  const [expiryDays, setExpiryDays] = useState(7)
  const [loading, setLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const { userProfile } = useAuth()
  const { codes, generateCode, deleteCode, getActiveCodesByRole, getUsedCodes, getExpiredCodes } = useInvitationCodes()

  const canManageCodes = userProfile?.role === "admin"

  const handleGenerateCode = async () => {
    if (!canManageCodes) return

    setLoading(true)
    try {
      const result = await generateCode(selectedRole, expiryDays)
      setShowGenerateModal(false)

      // Auto-copy the generated code
      await navigator.clipboard.writeText(result.code)
      setCopiedCode(result.code)
      setTimeout(() => setCopiedCode(null), 3000)
    } catch (error) {
      console.error("Failed to generate code:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
    }
  }

  const handleDeleteCode = async (codeId: string) => {
    if (!canManageCodes) return

    try {
      await deleteCode(codeId)
    } catch (error) {
      console.error("Failed to delete code:", error)
    }
  }

  const getStatusBadge = (code: any) => {
    if (code.isUsed) {
      return <div className="badge badge-success">Used</div>
    } else if (code.expiresAt <= new Date()) {
      return <div className="badge badge-error">Expired</div>
    } else {
      return <div className="badge badge-warning">Active</div>
    }
  }

  const getRoleIcon = (role: string) => {
    return role === "admin" ? <Shield className="h-4 w-4 text-error" /> : <Users className="h-4 w-4 text-warning" />
  }

  if (!canManageCodes) {
    return (
      <div className="alert alert-warning">
        <Shield className="h-5 w-5" />
        <span>Only administrators can manage invitation codes.</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="h-7 w-7 text-primary" />
            Invitation Codes
          </h2>
          <p className="text-base-content/60">
            Generate and manage registration codes
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowGenerateModal(true)}
        >
          <Plus className="h-5 w-5" />
          Generate Code
        </button>
      </div>

      {/* Stats */}
      <div className="stats shadow w-full">
        <div className="stat">
          <div className="stat-title">Active Admin Codes</div>
          <div className="stat-value text-error">
            {getActiveCodesByRole("admin").length}
          </div>
          <div className="stat-desc">Ready to use</div>
        </div>

        <div className="stat">
          <div className="stat-title">Active Manager Codes</div>
          <div className="stat-value text-warning">
            {getActiveCodesByRole("manager").length}
          </div>
          <div className="stat-desc">Ready to use</div>
        </div>

        <div className="stat">
          <div className="stat-title">Used Codes</div>
          <div className="stat-value text-success">{getUsedCodes().length}</div>
          <div className="stat-desc">Successful registrations</div>
        </div>

        <div className="stat">
          <div className="stat-title">Expired Codes</div>
          <div className="stat-value text-neutral">
            {getExpiredCodes().length}
          </div>
          <div className="stat-desc">Need cleanup</div>
        </div>
      </div>

      {/* Codes Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Role</th>
                  <th>Created By</th>
                  <th>Status</th>
                  <th>Expires</th>
                  <th>Used By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {codes.map((code) => (
                  <tr key={code.id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-lg font-bold">
                          {code.code}
                        </code>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleCopyCode(code.code)}
                          title="Copy code"
                        >
                          {copiedCode === code.code ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {getRoleIcon(code.role)}
                        <span className="capitalize font-medium">
                          {code.role}
                        </span>
                      </div>
                    </td>
                    <td>{code.createdByName}</td>
                    <td>{getStatusBadge(code)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-base-content/60" />
                        <span className="text-sm">
                          {format(code.expiresAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                    </td>
                    <td>
                      {code.isUsed ? (
                        <div>
                          <div className="font-medium">{code.usedBy}</div>
                          <div className="text-xs text-base-content/60">
                            {code.usedAt && format(code.usedAt, "MMM dd, yyyy")}
                          </div>
                        </div>
                      ) : (
                        <span className="text-base-content/40">—</span>
                      )}
                    </td>
                    <td>
                      {!code.isUsed && (
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDeleteCode(code.id)}
                          title="Delete code"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {codes.length === 0 && (
            <div className="text-center py-8">
              <Key className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No invitation codes
              </h3>
              <p className="text-base-content/60 mb-4">
                Generate your first invitation code to get started
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowGenerateModal(true)}
              >
                <Plus className="h-5 w-5" />
                Generate Code
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generate Code Modal */}
      {showGenerateModal && (
        <div
          
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >
          <div   className="bg-base-100 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="font-bold text-lg mb-4">Generate Invitation Code</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedRole}
                  onChange={(e) =>
                    setSelectedRole(e.target.value as "admin" | "manager")
                  }
                >
                  <option value="manager">Manager</option>
                  <option value="admin">Administrator</option>
                </select>
                <label className="label">
                  <span className="label-text-alt">
                    {selectedRole === "admin"
                      ? "Full system access and management"
                      : "Department management and employee oversight"}
                  </span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Expires in (days)</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  value={expiryDays}
                  onChange={(e) =>
                    setExpiryDays(Number.parseInt(e.target.value) || 7)
                  }
                  min={1}
                  max={30}
                />
                <label className="label">
                  <span className="label-text-alt">
                    Code will expire in {expiryDays} days
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setShowGenerateModal(false)}
              >
                Cancel
              </button>
              <button
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                onClick={handleGenerateCode}
                disabled={loading}
              >
                {loading ? "Generating..." : "Generate Code"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {copiedCode && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <CheckCircle className="h-5 w-5" />
            <span>Code copied to clipboard!</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvitationCodeManager
