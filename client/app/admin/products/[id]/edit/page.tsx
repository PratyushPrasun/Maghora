"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { useAdminProducts, useUpdateProduct } from "@/hooks/useProducts";
import { useAdminCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const variantSchema = z.object({
  variantId: z.string().optional(),
  sku: z.string().trim().min(2, "SKU required").max(40),
  weightGrams: z.number().int().positive(),
  pricePaise: z.number().int().positive(),
  mrpPaise: z.number().int().positive(),
  isActive: z.boolean(),
});

const updateProductSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Please select a category"),
  shortDescription: z.string().trim().max(250).optional(),
  description: z.string().trim().min(10).max(5000),
  isFeatured: z.boolean(),
  variants: z.array(variantSchema).min(1),
  seoTitle: z.string().max(70).optional(),
  seoDescription: z.string().max(170).optional(),
});

type FormValues = z.infer<typeof updateProductSchema>;

export default function EditProductPage() {
  const params = useParams();
  const productId = (params?.id as string) || "";
  const router = useRouter();

  const { data: productsData, isLoading: loadingProducts } = useAdminProducts({ limit: 50 });
  const { data: categories } = useAdminCategories();
  const updateProductMutation = useUpdateProduct();

  const currentProduct = productsData?.products?.find((p) => p._id === productId);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [removePublicIds, setRemovePublicIds] = useState<string[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      isFeatured: false,
      shortDescription: "",
      seoTitle: "",
      seoDescription: "",
      variants: [],
    },
  });

  const { fields, append } = useFieldArray({
    control,
    name: "variants",
  });

  // Populate form with existing product data
  useEffect(() => {
    if (currentProduct) {
      reset({
        name: currentProduct.name,
        category:
          typeof currentProduct.category === "object"
            ? (currentProduct.category as any)._id
            : currentProduct.category,
        shortDescription: currentProduct.shortDescription || "",
        description: currentProduct.description || "",
        isFeatured: currentProduct.isFeatured || false,
        seoTitle: currentProduct.seo?.title || "",
        seoDescription: currentProduct.seo?.description || "",
        variants: currentProduct.variants?.map((v) => ({
          variantId: v._id,
          sku: v.sku || "SKU-STD",
          weightGrams: v.weightGrams,
          pricePaise: v.pricePaise,
          mrpPaise: v.mrpPaise,
          isActive: v.isActive !== false,
        })) || [],
      });
    }
  }, [currentProduct, reset]);

  if (loadingProducts) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-foreground">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The requested product ID does not exist in the catalogue.
        </p>
        <Link href="/admin/products">
          <Button>Back to Products</Button>
        </Link>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFilePreviews([...filePreviews, ...previews]);
  };

  const toggleRemoveExistingImage = (publicId: string) => {
    setRemovePublicIds((prev) =>
      prev.includes(publicId) ? prev.filter((id) => id !== publicId) : [...prev, publicId]
    );
  };

  const onSubmit = async (data: FormValues) => {
    try {
      const payload: any = {
        name: data.name,
        category: data.category,
        description: data.description,
        shortDescription: data.shortDescription,
        isFeatured: data.isFeatured,
        variants: data.variants.map((v) => ({
          ...(v.variantId ? { variantId: v.variantId } : {}),
          sku: v.sku.toUpperCase(),
          weightGrams: Number(v.weightGrams),
          pricePaise: Number(v.pricePaise),
          mrpPaise: Number(v.mrpPaise),
          isActive: v.isActive,
        })),
        seo: {
          title: data.seoTitle || "",
          description: data.seoDescription || "",
        },
      };

      if (removePublicIds.length > 0) {
        payload.removeImagePublicIds = removePublicIds;
      }

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      selectedFiles.forEach((file) => {
        formData.append("images", file);
      });

      await updateProductMutation.mutateAsync({
        id: productId,
        formData,
      });

      router.push("/admin/products");
    } catch {
      // Handled in hook
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Products
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-foreground">
          Edit Product: {currentProduct.name}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Update catalogue content, manage existing Cloudinary images, and refine variants
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Details */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Product Name *</Label>
              <Input {...register("name")} error={errors.name?.message} />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category *</Label>
              <select
                {...register("category")}
                className="flex h-11 w-full rounded-xl border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Featured on Storefront?</Label>
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featuredEdit"
                  {...register("isFeatured")}
                  className="h-4 w-4 text-primary rounded"
                />
                <label htmlFor="featuredEdit" className="text-xs text-foreground cursor-pointer">
                  Featured Product
                </label>
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Short Catchline</Label>
              <Input {...register("shortDescription")} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-semibold">Full Description *</Label>
              <Textarea {...register("description")} rows={4} error={errors.description?.message} />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-border/60">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Variants & Pricing
              </h2>
              <p className="text-xs text-muted-foreground">
                Inventory is preserved for existing variants. Price is in Paise.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                append({
                  sku: `NEW-${Date.now().toString().slice(-4)}`,
                  weightGrams: 100,
                  pricePaise: 24900,
                  mrpPaise: 29900,
                  isActive: true,
                })
              }
              className="text-xs gap-1"
            >
              <Plus className="h-3.5 w-3.5" /> Add New Variant
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
                    Variant #{index + 1} {field.variantId ? "(Existing)" : "(New)"}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      {...register(`variants.${index}.isActive` as const)}
                      className="h-3.5 w-3.5 text-primary rounded"
                    />
                    <span>Active</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-[11px]">SKU *</Label>
                    <Input
                      {...register(`variants.${index}.sku` as const)}
                      className="uppercase font-mono text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Weight (g) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.weightGrams` as const, { valueAsNumber: true })}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">Price (Paise) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.pricePaise` as const, { valueAsNumber: true })}
                      className="text-xs h-9"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px]">MRP (Paise) *</Label>
                    <Input
                      type="number"
                      {...register(`variants.${index}.mrpPaise` as const, { valueAsNumber: true })}
                      className="text-xs h-9"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cloudinary Image Management */}
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-foreground pb-3 border-b border-border/60">
            Image Management
          </h2>

          {/* Existing images */}
          {currentProduct.images && currentProduct.images.length > 0 && (
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Existing Cloudinary Images:</Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {currentProduct.images.map((img, idx) => {
                  const isMarked = img.publicId && removePublicIds.includes(img.publicId);
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                        isMarked ? "border-destructive opacity-40 grayscale" : "border-border"
                      }`}
                    >
                      <img src={img.url} alt="Product image" className="w-full h-full object-cover" />
                      {img.publicId && (
                        <button
                          type="button"
                          onClick={() => toggleRemoveExistingImage(img.publicId!)}
                          className={`absolute bottom-1 right-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isMarked ? "bg-primary text-white" : "bg-destructive text-white"
                          }`}
                        >
                          {isMarked ? "Keep" : "Remove"}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload new images */}
          <div className="pt-4 border-t border-border/60 space-y-2">
            <Label className="text-xs font-semibold">Upload Additional Images:</Label>
            <input
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="text-xs"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" size="lg" isLoading={updateProductMutation.isPending} className="font-bold">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
