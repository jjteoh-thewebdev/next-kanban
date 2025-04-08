"use client"

import type React from "react"

import { useState } from "react"
import { useBoard } from "./context/board-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, ImageIcon, Palette, Edit, Check } from "lucide-react"
import { useToast } from "./ui/use-toast"

export function BoardHeader() {
  const { board, updateBackground } = useBoard()
  const [color, setColor] = useState(board.background.type === "color" ? board.background.value : "#f0f4f8")
  const [imageUrl, setImageUrl] = useState(board.background.type === "image" ? board.background.value : "")
  const [fileInputKey, setFileInputKey] = useState(0)
  const [boardTitle, setBoardTitle] = useState("Kanban Board")
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const { toast } = useToast()

  const handleColorChange = (newColor: string) => {
    setColor(newColor)
    updateBackground({ type: "color", value: newColor })
  }

  const handleImageUrlChange = async () => {
    if (imageUrl.trim()) {
      updateBackground({ type: "image", value: imageUrl })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        // clear the file input
        // key={fileInputKey}, setting key with new value will trigger react to re-render the file input(nullify the file input)
        setFileInputKey((key) => key + 1)

        toast({
          title: "File too large",
          description: "Please upload a file smaller than 4MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        setImageUrl("")
        updateBackground({ type: "image", value: result })
        // key={fileInputKey}, setting key with new value will trigger react to re-render the file input(nullify the file input)
        setFileInputKey((key) => key + 1) // Reset file input
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClearImage = () => {
    setImageUrl("")
    updateBackground({ type: "color", value: "#f0f4f8" })
  }

  const handleTitleSave = () => {
    if (boardTitle.trim()) {
      setIsEditingTitle(false)
    } else {
      setBoardTitle("Kanban Board")
      setIsEditingTitle(false)
    }
  }

  const predefinedColors = [
    "#f0f4f8", // Light blue/gray
    "#f3f4f6", // Light gray
    "#6898f7", // Light indigo
    "#90d6a2", // Light green
    "#fff7ed", // Light orange
    "#fef2f2", // Light red
    "#f8fafc", // Light slate
    "#faf5ff", // Light purple
  ]

  const predefinedImages = [
    "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1887&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1743191771058-d06e793dda2d?q=80&w=1887&auto=format&fit=crop",
  ]

  return (
    <div className="flex justify-between items-center py-4">
      <div className="flex items-center gap-2">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <Input
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="text-2xl font-bold h-auto py-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSave()
                if (e.key === "Escape") {
                  setIsEditingTitle(false)
                }
              }}
            />
            <Button variant="ghost" size="icon" onClick={handleTitleSave}>
              <Check className="h-5 w-5" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{boardTitle}</h1>
            <Button variant="ghost" size="icon" onClick={() => setIsEditingTitle(true)}>
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Board settings</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <h3 className="font-medium mb-2">Board Settings</h3>
          <Tabs defaultValue="colors">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="colors">
                <Palette className="h-4 w-4 mr-2" /> Colors
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="h-4 w-4 mr-2" /> Images
              </TabsTrigger>
            </TabsList>
            <TabsContent value="colors" className="space-y-4 mt-2">
              <div className="grid grid-cols-4 gap-2">
                {predefinedColors.map((presetColor) => (
                  <div
                    key={presetColor}
                    className="w-12 h-12 rounded-md cursor-pointer border"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => handleColorChange(presetColor)}
                  />
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-color">Custom Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-color"
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={color} onChange={(e) => handleColorChange(e.target.value)} className="flex-grow" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="images" className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-2">
                {predefinedImages.map((presetImage) => (
                  <div
                    key={presetImage}
                    className="h-20 rounded-md cursor-pointer overflow-hidden"
                    onClick={() => {
                      setImageUrl("")
                      updateBackground({ type: "image", value: presetImage })
                    }}
                  >
                    <img
                      src={presetImage || "/placeholder.svg"}
                      alt="Background option"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-grow"
                  />
                  <Button onClick={handleImageUrlChange}>Apply</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-upload">Upload Image</Label>
                <Input key={fileInputKey} id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} />
                <Button className="w-full" disabled={board.background.type !== 'image'} onClick={handleClearImage}>Clear Image</Button>
              </div>
            </TabsContent>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  )
}
