"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { type Card as CardType, type Priority, useBoard } from "./context/board-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { nanoid } from "nanoid"
import { Clock, Edit, ImageIcon, Plus, Save, Tag, Trash2, User, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

interface CardDrawerProps {
  card: CardType | null
  columnId: string | null
  onClose: () => void
}

export function CardDrawer({ card, columnId, onClose }: CardDrawerProps) {
  const { updateCard, deleteCard } = useBoard()
  const [editedCard, setEditedCard] = useState<CardType | null>(card ? { ...card } : null)
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!card || !editedCard || !columnId) return null

  const handleSave = () => {
    updateCard(columnId, editedCard)
    setIsEditing(false)
  }

  const handleDelete = () => {
    deleteCard(columnId, card.id)
    onClose()
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setEditedCard({
        ...editedCard,
        checklist: [...editedCard.checklist, { id: nanoid(), text: newChecklistItem, checked: false }],
      })
      setNewChecklistItem("")
    }
  }

  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    setEditedCard({
      ...editedCard,
      checklist: editedCard.checklist.map((item) => (item.id === itemId ? { ...item, checked } : item)),
    })
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    setEditedCard({
      ...editedCard,
      checklist: editedCard.checklist.filter((item) => item.id !== itemId),
    })
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedCard.tags.includes(newTag.trim())) {
      setEditedCard({
        ...editedCard,
        tags: [...editedCard.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const handleDeleteTag = (tag: string) => {
    setEditedCard({
      ...editedCard,
      tags: editedCard.tags.filter((t) => t !== tag),
    })
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setEditedCard({
          ...editedCard,
          image: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setEditedCard({
      ...editedCard,
      image: null,
    })
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 dark:text-red-400"
      case "medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "low":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  return (
    <>
      <Sheet key={card?.id} open={!!card} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="flex flex-row items-center justify-between">
          <SheetTitle className="flex-1">
            {isEditing ? (
              <Input
                value={editedCard.title}
                onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
                className="text-xl font-semibold"
              />
            ) : (
              <div className="text-xl font-semibold">{editedCard.title}</div>
            )}
          </SheetTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Save className="h-5 w-5" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                <Edit className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-red-500" onClick={handleDelete}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            Created on {formatDate(editedCard.createdAt)}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            {isEditing ? (
              <Textarea
                id="description"
                value={editedCard.description}
                onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
                placeholder="Add a more detailed description..."
                className="min-h-[100px]"
              />
            ) : (
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                {editedCard.description || "No description provided."}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            {isEditing ? (
              <Select
                value={editedCard.priority}
                onValueChange={(value: Priority) => setEditedCard({ ...editedCard, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className={`font-medium ${getPriorityColor(editedCard.priority)}`}>
                {editedCard.priority.charAt(0).toUpperCase() + editedCard.priority.slice(1)}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee">Assignee</Label>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Input
                  id="assignee"
                  value={editedCard.assignee || ""}
                  onChange={(e) => setEditedCard({ ...editedCard, assignee: e.target.value || null })}
                  placeholder="Add assignee..."
                />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{editedCard.assignee || "Unassigned"}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Checklist</Label>
              <span className="text-sm text-gray-500">
                {editedCard.checklist.filter((item) => item.checked).length}/{editedCard.checklist.length}
              </span>
            </div>
            <div className="space-y-2">
              {editedCard.checklist.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => handleChecklistItemChange(item.id, checked as boolean)}
                    disabled={!isEditing}
                  />
                  {isEditing ? (
                    <>
                      <Input
                        value={item.text}
                        onChange={(e) => {
                          setEditedCard({
                            ...editedCard,
                            checklist: editedCard.checklist.map((i) =>
                              i.id === item.id ? { ...i, text: e.target.value } : i,
                            ),
                          })
                        }}
                        className="flex-grow"
                      />
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteChecklistItem(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <span className={item.checked ? "line-through text-gray-500" : ""}>{item.text}</span>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add checklist item..."
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddChecklistItem()
                  }}
                />
                <Button variant="outline" onClick={handleAddChecklistItem}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1 mb-2">
              {editedCard.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  {isEditing && <X className="h-3 w-3 cursor-pointer" onClick={() => handleDeleteTag(tag)} />}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag()
                  }}
                />
                <Button variant="outline" onClick={handleAddTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Image</Label>
            {editedCard.image ? (
              <div className="relative">
                <Image
                  src={editedCard.image || "/placeholder.svg"}
                  alt="Card attachment"
                  width={400}
                  height={200}
                  className="w-full h-auto object-cover rounded-md"
                />
                {isEditing && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : isEditing ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                  <ImageIcon className="h-4 w-4 mr-2" /> Upload Image
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="text-gray-500">No image attached</div>
            )}
          </div>
        </div>
      </SheetContent>
      </Sheet>
    </>
  )
}
