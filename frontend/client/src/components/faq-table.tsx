import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import { getFaqs, createFaq, updateFaq, deleteFaq } from "@/services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFaqSchema } from "@shared/schema";
import type { Faq, InsertFaq } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const faqFormSchema = insertFaqSchema.extend({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().min(1, "Category is required"),
});

const categories = ["General", "Technical", "Billing", "Support"];

export function FaqTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ["/api/faqs", searchQuery, selectedCategory],
    queryFn: () => getFaqs(searchQuery || undefined, selectedCategory !== "All Categories" ? selectedCategory : undefined),
  });

  const form = useForm<z.infer<typeof faqFormSchema>>({
    resolver: zodResolver(faqFormSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "General",
    },
  });

  const createMutation = useMutation({
    mutationFn: createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "FAQ created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create FAQ",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<InsertFaq> }) =>
      updateFaq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      setIsDialogOpen(false);
      setEditingFaq(null);
      form.reset();
      toast({
        title: "Success",
        description: "FAQ updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update FAQ",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/faqs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "FAQ deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete FAQ",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof faqFormSchema>) => {
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    form.reset({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleNewFaq = () => {
    setEditingFaq(null);
    form.reset({
      question: "",
      answer: "",
      category: "General",
    });
    setIsDialogOpen(true);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "General":
        return "bg-primary/10 text-primary";
      case "Technical":
        return "bg-accent/10 text-accent-foreground";
      case "Billing":
        return "bg-yellow-100 text-yellow-800";
      case "Support":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">FAQ Database</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
                data-testid="input-search-faqs"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48" data-testid="select-category-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewFaq} data-testid="button-add-faq">
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                  <DialogTitle>
                    {editingFaq ? "Edit FAQ" : "Create New FAQ"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingFaq 
                      ? "Update the FAQ information below." 
                      : "Add a new frequently asked question to your knowledge base."
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="question"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-faq-question" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="answer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Answer</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4} 
                              data-testid="input-faq-answer"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-faq-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={createMutation.isPending || updateMutation.isPending}
                        data-testid="button-save-faq"
                      >
                        {editingFaq ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-left p-4 font-medium text-muted-foreground">
                Question
              </TableHead>
              <TableHead className="text-left p-4 font-medium text-muted-foreground">
                Category
              </TableHead>
              <TableHead className="text-left p-4 font-medium text-muted-foreground">
                Usage
              </TableHead>
              <TableHead className="text-left p-4 font-medium text-muted-foreground">
                Last Updated
              </TableHead>
              <TableHead className="text-left p-4 font-medium text-muted-foreground">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Loading FAQs...
                </TableCell>
              </TableRow>
            ) : faqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No FAQs found. {searchQuery && "Try adjusting your search criteria."}
                </TableCell>
              </TableRow>
            ) : (
              faqs.map((faq) => (
                <TableRow
                  key={faq.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                  data-testid={`row-faq-${faq.id}`}
                >
                  <TableCell className="p-4">
                    <div>
                      <p className="font-medium text-sm">{faq.question}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {faq.answer.length > 80 
                          ? `${faq.answer.substring(0, 80)}...` 
                          : faq.answer
                        }
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="p-4">
                    <Badge
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(faq.category)}`}
                    >
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-sm">{faq.usage_count} times</span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(faq.updated_at)}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(faq)}
                        data-testid={`button-edit-faq-${faq.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(faq.id)}
                        data-testid={`button-delete-faq-${faq.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
