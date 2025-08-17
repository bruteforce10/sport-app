"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, Instagram, Facebook, Music } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { sportCategories } from "../../communities";
import CityAutocomplete from "../../components/CityAutocomplete";

const formSchema = z.object({
  category: z.string({
    required_error: "Pilih cabang olahraga",
  }),
  name: z.string().min(3, {
    message: "Nama komunitas minimal 3 karakter",
  }).max(100, {
    message: "Nama komunitas maksimal 100 karakter",
  }),
  city: z.string().min(2, {
    message: "Nama kota minimal 2 karakter",
  }),
  description: z.string().min(30, {
    message: "Deskripsi komunitas minimal 30 karakter",
  }).max(500, {
    message: "Deskripsi komunitas maksimal 500 karakter",
  }),
  socialMedia: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    tiktok: z.string().optional(),
  }),
  privacy: z.enum(["open", "closed"], {
    required_error: "Pilih privasi komunitas",
  }),
});

export default function CreateCommunityPage() {
  const router = useRouter();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      name: "",
      city: "",
      description: "",
      socialMedia: {
        instagram: "",
        facebook: "",
        tiktok: "",
      },
      privacy: "open",
    },
  });

  async function onSubmit(values) {
    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create community');
      }

      const result = await response.json();
      console.log('Community created:', result);
      
      alert("Komunitas berhasil dibuat!");
      router.push("/komunitas");
    } catch (error) {
      console.error('Error creating community:', error);
      alert(`Gagal membuat komunitas: ${error.message}`);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buat Komunitas</h1>
              <p className="text-gray-600">Tetap terhubung dengan anggota lain di setiap aktivitas!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Category Selection */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Cabang Olahraga</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="Pilih cabang olahraga" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sportCategories.map((category) => (
                          <SelectItem key={category.name} value={category.name}>
                            <div className="flex items-center space-x-3">
                              <span className="text-2xl">{category.icon}</span>
                              <span>{category.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Community Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Nama Komunitas</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Masukkan nama komunitas" 
                        className="h-12"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City */}
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Kota</FormLabel>
                    <FormControl>
                      <CityAutocomplete
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Masukkan nama kota"
                        className="h-12"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">Deskripsi Komunitas</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jelaskan tentang komunitas Anda, aktivitas yang dilakukan, dan tujuan komunitas"
                        className="min-h-[120px] resize-none"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription className="text-right text-sm text-gray-500">
                      Minimal 30 karakter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Social Media */}
              <div className="space-y-4">
                <FormLabel className="text-base font-semibold">Social Media</FormLabel>
                
                <FormField
                  control={form.control}
                  name="socialMedia.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Instagram</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input 
                            placeholder="@username atau username" 
                            className="h-12 pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Facebook</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input 
                            placeholder="Nama halaman Facebook" 
                            className="h-12 pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialMedia.tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">TikTok</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Music className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <Input 
                            placeholder="@username atau username" 
                            className="h-12 pl-10"
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Privacy Settings */}
              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-base font-semibold">Privasi Komunitas</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-3"
                      >
                        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                          <RadioGroupItem value="open" id="open" className="mt-1" />
                          <div className="flex-1">
                            <label htmlFor="open" className="text-sm font-medium text-gray-900 cursor-pointer">
                              Terbuka
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                              Anggota dapat bergabung ke komunitas tanpa persetujuan admin.
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                          <RadioGroupItem value="closed" id="closed" className="mt-1" />
                          <div className="flex-1">
                            <label htmlFor="closed" className="text-sm font-medium text-gray-900 cursor-pointer">
                              Tertutup
                            </label>
                            <p className="text-sm text-gray-600 mt-1">
                              Hanya anggota dengan persetujuan admin yang dapat bergabung.
                            </p>
                          </div>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                >
                  Simpan Komunitas
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
