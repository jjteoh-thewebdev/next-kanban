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
import { Calendar1, Clock, Edit, ImageIcon, Plus, Save, Tag, Trash2, User, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "./ui/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getInitials, getColorFromName, formatDate, getPriorityColor, cn } from "@/lib/utils"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CardDrawerProps {
  card: CardType | null
  columnId: string | null
  onClose: () => void
}

export function CardDrawer({ card, columnId, onClose }: CardDrawerProps) {
  // Context
  const { updateCard, deleteCard } = useBoard()
  const { toast } = useToast()
  const isMobile = useIsMobile()

  // State
  const [editedCard, setEditedCard] = useState<CardType | null>(card ? { ...card } : null)
  const [newChecklistItem, setNewChecklistItem] = useState("")
  const [newAssignee, setNewAssignee] = useState("")
  const [newTag, setNewTag] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isExitConfirmationOpen, setIsExitConfirmationOpen] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!card || !editedCard || !columnId) return null

  const handleSave = () => {
    updateCard(columnId, editedCard)
    setIsEditing(false)
    toast({
      title: "Card updated",
      description: "Card updated successfully",
    })
  }

  const handleDelete = () => {
    deleteCard(columnId, card.id)

    // close the drawer
    onClose()
  }

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setEditedCard({
        ...editedCard,
        checklist: [...editedCard.checklist, { id: nanoid(), text: newChecklistItem, checked: false }],
      })
      setNewChecklistItem("")
      setHasChanges(true)
    }
  }

  const handleChecklistItemChange = (itemId: string, checked: boolean) => {
    setEditedCard({
      ...editedCard,
      checklist: editedCard.checklist.map((item) => (item.id === itemId ? { ...item, checked } : item)),
    })
    setHasChanges(true)
  }

  const handleDeleteChecklistItem = (itemId: string) => {
    setEditedCard({
      ...editedCard,
      checklist: editedCard.checklist.filter((item) => item.id !== itemId),
    })
    setHasChanges(true)
  }

  const handleAddAssignee = () => {
    if (newAssignee.trim() && !editedCard.assignees?.includes(newAssignee.trim())) {
      setEditedCard({
        ...editedCard,
        assignees: [...editedCard.assignees, newAssignee.trim()]
      })
      setNewAssignee("")
      setHasChanges(true)
    }
  }

  const handleDeleteAssignee = (assignee: string) => {
    setEditedCard({
      ...editedCard,
      assignees: editedCard.assignees.filter((a) => a !== assignee),
    })
    setHasChanges(true)
  }

  const handleAddTag = () => {
    if (newTag.trim() && !editedCard.tags.includes(newTag.trim())) {
      setEditedCard({
        ...editedCard,
        tags: [...editedCard.tags, newTag.trim()],
      })
      setNewTag("")
      setHasChanges(true)
    }
  }

  const handleDeleteTag = (tag: string) => {
    setEditedCard({
      ...editedCard,
      tags: editedCard.tags.filter((t) => t !== tag),
    })
    setHasChanges(true)
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {

        // update the card with the new image
        setEditedCard({
          ...editedCard,
          image: event.target?.result as string,
        })
        setHasChanges(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setEditedCard({
      ...editedCard,
      image: null,
    })
    setHasChanges(true)
  }

  const handleExitWithoutSave = () => {
    setIsExitConfirmationOpen(false)
    onClose()

    setEditedCard(null)
  }

  const handleSaveAndExit = () => {
    handleSave()
    onClose()

    setEditedCard(null)
  }

  const handleClose = () => {
    if (isEditing && hasChanges) {
      // show a confirmation dialog
      setIsExitConfirmationOpen(true)
    } else {
      onClose()
    }
  }


  return (
    <>
      <Sheet key={card?.id} open={!!card} onOpenChange={() => handleClose()}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={`overflow-y-auto ${isMobile
            ? "w-full h-[85vh]"
            : "w-full h-full sm:max-w-md md:max-w-lg lg:max-w-xl"
            }`}
        >
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

              {/* Delete card confirmation dialog */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permenantly delete the card.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {/* Exit without save confirmation dialog */}
              <AlertDialog open={isExitConfirmationOpen} onOpenChange={setIsExitConfirmationOpen}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>You have unsaved changes</AlertDialogTitle>
                    <AlertDialogDescription>
                      You have uncommitted changes. Do you want to save the changes before exiting?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button variant="outline" onClick={handleExitWithoutSave}>
                      Exit without save
                    </Button>
                    <Button onClick={handleSaveAndExit}>
                      Save and exit
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
            <div className="flex flex-col gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
              Created on {formatDate(new Date(editedCard.createdAt))}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last updated on {formatDate(new Date(editedCard.updatedAt))}
              </div>
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
                  defaultValue={editedCard.priority}
                  onValueChange={(value: Priority) => {
                    if (editedCard) {
                      setEditedCard({
                        ...editedCard,
                        priority: value
                      });
                    }
                  }}
              >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority">
                      {editedCard.priority.charAt(0).toUpperCase() + editedCard.priority.slice(1)}
                    </SelectValue>
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
              <Label htmlFor="dueAt">Due on</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar1 className="mr-2 h-4 w-4" />
                      {editedCard.dueAt ? (
                        formatDate(new Date(editedCard.dueAt))
                      ) : (
                        "Choose a date"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedCard.dueAt ? new Date(editedCard.dueAt) : undefined}
                      onSelect={(date: Date | undefined) => date && setEditedCard({ ...editedCard, dueAt: date })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <div className="flex items-center gap-2">
                  <Calendar1 className="h-4 w-4" />
                  <span className={cn("text-sm", editedCard.dueAt && new Date(editedCard.dueAt) < new Date() ? "text-red-500" : "text-gray-500")}>
                    {editedCard.dueAt ? formatDate(new Date(editedCard.dueAt)) : "Not specified"}
                  </span>
                </div>
              )}
            </div>

          <div className="space-y-2">
              <Label htmlFor="assignee">Assignees</Label>

              <div className="flex flex-col flex-wrap gap-2">
                {editedCard.assignees ?
                  editedCard.assignees.map((assignee) => (
                    <div key={assignee} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 text-xs">
                        <AvatarFallback className={`${getColorFromName(assignee)} text-white`}>
                          {getInitials(assignee)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-500">{assignee}</span>
                      {isEditing && <X className="h-3 w-3 cursor-pointer" onClick={() => handleDeleteAssignee(assignee)} />}
                    </div>
                  ))
                  :
                  <span>Unassigned</span>
                }
              </div>
              {isEditing && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <Input
                    id="assignee"
                    value={newAssignee || ""}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddAssignee()
                    }}
                    placeholder="Add assignee..."
                  />
                </div>
              )
              }

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
