"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { useAdminCategories } from "@/hooks/useCategories";
import { useCreateProduct } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const variantSchema = z.object({
  sku: z.string().trim().min(2, "SKU required").max(40),
  weightGrams: z.number().int().positive("Weight in grams required"),
  pricePaise: z.number().int().positive("Selling price in paise required"),
  mrpPaise: z.number().int().positive("MRP in paise required"),
  stock: z.number().int().min(0, "Stock cannot be negative"),
  isActive: z.boolean(),
});

const createProductSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 chars").max(120),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a valid category"),
  shortDescription: z.string().trim().max(250).optional(),
  description: z.string().trim().min(10, "Description must be at least 10 chars").max(5000),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1, "At least one variant required"),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
});

type FormDataValues = z.infer<typeof createProductSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { data: categories } = useAdminCategories();
  const createProductMutation = useCreateProduct();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      isFeatured: false,
      shortDescription: "",
      seoTitle: "",
      seoDescription: "",
      variants: [
        {
          sku: "MG-100G",
          weightGrams: 100,
          pricePaise: 24900,
          mrpPaise: 29900,
          stock: 50,
          isActive: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 8) {
      toast.error("You can upload a maximum of 8 images per product.");
      return;
    }

    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    setFilePreviews(updatedFiles.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (data: FormDataValues) => {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        shortDescription: data.shortDescription || "",
        category: data.category,
        variants: data.variants.map((v) => ({
          sku: v.sku.toUpperCase(),
          weightGrams: Number(v.weightGrams),
          pricePaise: Number(v.pricePaise),
          mrpPaise: Number(v.mrpPaise),
          stock: Number(v.stock),
          isActive: v.isActive,
        })),
        isFeatured: data.isFeatured,
        seo: {
          title: data.seoTitle || "",
          description: data.seoDescription || "",
        },
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await createProductMutation.mutateAsync(formData);
      router.push("/admin/products");
    } catch {
      // Handled in mutation hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          Create New Makhana Product
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configure product details, pack sizes, Cloudinary imagery, and initial inventory
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Product Name *</Label>
              <Input
                {...register("name")}
                placeholder="e.g. Peri Peri Smoked Makhana"
                error={errors.name?.message}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category *</Label>
              <select
                {...register("category")}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                <option value="">Select a category...</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Featured on Homepage?</Label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  {...register("isFeatured")}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor="featuredCheckbox" className="text-xs text-foreground cursor-pointer">
                  Mark as Bestseller / Featured
                </label>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Short Catchline</Label>
              <Input
                {...register("shortDescription")}
                placeholder="e.g. Slow-roasted in olive oil with fiery African bird's eye chili."
                error={errors.shortDescription?.message}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Full Description *</Label>
              <Textarea
                {...register("description")}
                placeholder="Detailed tasting notes, ingredients, dietary specifications..."
                rows={4}
                error={errors.description?.message}
              />
            </div>
          </div>
        </div>

        {/* Variants & Inventory Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Flavour Variants & Pricing
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Note: Prices are in Paise (e.g. ₹249 = 24900 paise)
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  sku: `MG-${Date.now().toString().slice(-4)}`,
                  weightGrams: 100,
                  pricePaise: 24900,
                  mrpPaise: 29900,
                  stock: 50,
                  isActive: true,
                })
              }
              className="text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add Variant
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 rounded-2xl border border-border/80 bg-background space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Variant #{index + 1}
                  </span>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive p-1"
                      title="Remove variant"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">SKU *</Label>
                    <Input
                      {...register(`variants.${index}.sku` as const)}
                      placeholder="SKU-100G"
                      className="uppercase font-mono text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Weight (grams) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.weightGrams` as const, { valueAsNumber: true })}
                      placeholder="100"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Price (Paise) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.pricePaise` as const, { valueAsNumber: true })}
                      placeholder="24900"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">MRP (Paise) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.mrpPaise` as const, { valueAsNumber: true })}
                      placeholder="29900"
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Initial Stock *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.stock` as const, { valueAsNumber: true })}
                      placeholder="50"
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudinary Image Upload Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Product Photography (Cloudinary)
          </h2>

          <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:bg-muted/30 transition-colors">
            <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">
              Click to select or drag and drop images
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Supports JPG, PNG, WebP up to 5MB (Max 8 images)
            </p>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
              id="productImageUpload"
            />
            <label htmlFor="productImageUpload" className="inline-block mt-4">
              <Button type="button" variant="outline" size="sm" className="pointer-events-none">
                Browse Files
              </Button>
            </label>
          </div>

          {/* Previews */}
          {filePreviews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 pt-3">
              {filePreviews.map((preview, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl border border-border bg-muted overflow-hidden"
                >
                  <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEO Meta Tags Card */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Search Engine Optimization (SEO)
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1">
              <Label className="text-xs">Meta Title</Label>
              <Input
                {...register("seoTitle")}
                placeholder="e.g. Peri Peri Flavoured Makhana | Maghora"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs">Meta Description</Label>
              <Textarea
                {...register("seoDescription")}
                placeholder="Brief summary for Google search results (up to 160 characters)"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="lg" isLoading={createProductMutation.isPending} className="font-bold">
            Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}
